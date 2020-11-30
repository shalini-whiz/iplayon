import {
    getDbNameforARole
}
from '../dbRequiredRole.js'

/**
 * Used by web application/ android application
 * Meteor Method to insert an event
 * @collectionName : events
 * @dbQuery : insert
 * @dataType : Object
 * @passedByValues : eventName, projectName, eventStartDate, eventEndDate,
 *            eventSubscriptionLastDate, domainName, subDomain1Name, subDomain2Name
 *            prize, eventOrganizer, description, sponsorPdf, sponsorLogo, sponsorUrl,
 *            sponsorMailId, rulesAndRegulations
 * @methodDescription : insert given data into events collection
 */
Meteor.methods({
    'insertEvents': function(xData, subscribRest, LdataToSaveFromDOB) {
        try {
            check(xData, Object);
            if(xData.paymentEntry == undefined){
                xData.paymentEntry = "no"
            }
            if(xData.schoolType==undefined || xData.schoolType == null ||
                xData.schoolType == false){
                xData.schoolType = ""
            }
            if (this.userId == null || this.userId == undefined)
                this.userId = xData.eventOrganizer;

            var findUserRole = Meteor.users.findOne({
                "userId": this.userId
            });
            if (findUserRole.role == "Association" || findUserRole.role == "Academy") 
            {
                check(subscribRest, Object);
                check(LdataToSaveFromDOB, Object);
            }
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


            if (xData.venueLatitude == null) {
                xData.venueLatitude = xData.timezoneIdEventLat
            }
            if (xData.venueLongitude == null) {
                xData.venueLongitude = xData.timezoneIdEventLng
            }
            if (xData.domainId) {
                var k = timeZone.findOne({
                    "state.stateId": xData.domainId.toString()
                })
            }

            var stateID = ""
            if(xData.eventOrganizer){
                var findWhichRole = Meteor.users.findOne({
                    "userId":xData.eventOrganizer
                })
                if(findWhichRole && findWhichRole.role){
                    var role = getDbNameforARole(findWhichRole.role)
                    if(role){
                        var findStateId = global[role].findOne(
                            {
                                userId:xData.eventOrganizer
                            }
                        )
                        if(findStateId && findStateId.affiliatedTo){
                            if(findStateId.role && 
                                findStateId.role=="Academy" && 
                                findStateId.affiliatedTo=="stateAssociation"){
                                if(findStateId.associationId){
                                    stateID = findStateId.associationId
                                }
                            }
                            else if(findStateId.affiliatedTo=="districtAssociation"){
                                if(findStateId.parentAssociationId){
                                    stateID = findStateId.parentAssociationId
                                }
                            }
                            else if(findStateId.associationType && 
                                findStateId.associationType=="State/Province/County"){
                                stateID = xData.eventOrganizer
                            }  
                            else if(findStateId.associationType &&
                                findStateId.associationType=="District/City" && 
                                findStateId.affiliatedTo=="stateAssociation"){
                                stateID = findStateId.parentAssociationId
                            } 
                        }
                    }
                }
            }

            var touProjectId = xData.projectId;
            var ls = events.insert({
                "eventName": xData.eventName,
                "projectId": xData.projectId,
                "eventStartDate": xData.eventStartDate,
                "eventEndDate": xData.eventEndDate,
                "eventSubscriptionLastDate": xData.eventSubscriptionLastDate,
                "domainId": xData.domainId,

                //"subDomain1Name":xData.subDomain1Name,
                //"subDomain2Name":xData.subDomain2Name,
                //"prize":xData.prize,
                //"prizePdfId":xData.prizePdfId,
                "eventOrganizer": xData.eventOrganizer,
                "description": xData.description,
                "sponsorPdf": xData.sponsorPdf,
                "sponsorLogo": xData.sponsorLogo,
                "sponsorUrl": xData.sponsorUrl,
                "sponsorMailId": xData.sponsorMailId,
                "rulesAndRegulations": xData.rulesAndRegulations,
                "domainName": xData.domainName,
                "projectName": xData.projectName,
                "venueLatitude": xData.venueLatitude,
                "venueLongitude": xData.venueLongitude,
                "venueAddress": xData.venueAddress,
                "eventStartDate1": moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                "eventEndDate1": moment(new Date(xData.eventEndDate)).format("YYYY-MM-DD"),
                "eventSubscriptionLastDate1": moment(new Date(xData.eventSubscriptionLastDate)).format("YYYY-MM-DD"),
                "offsetOfDomain": timeZoneOffset,
                "timeZoneName": timeZoneNames,
                "timezoneIdEventLat": xData.timezoneIdEventLat,
                "timezoneIdEventLng": xData.timezoneIdEventLng,
                "tournamentEvent": true,
                //"tournamentId":xData.tournamentId,
                "offset": new Date().getTimezoneOffset(),
                "subscriptionTypeDirect": xData.subscriptionTypeDirect,
                "subscriptionTypeHyper": xData.subscriptionTypeHyper,
                "hyperLinkValue": xData.hyperLinkValue,
                "subscriptionTypeMail": xData.subscriptionTypeMail,
                "subscriptionTypeMailValue": xData.subscriptionTypeMailValue,
                "paymentEntry":xData.paymentEntry,
                "tournamentType":xData.schoolType,
                "stateAssocId":stateID,
                //"subscriptionWithAffId":xData.subscriptionWithAffId

            });
            if (ls) {
                var insertCalenderEvents = calenderEvents.insert({
                    eventName: xData.eventName,
                    "_id": ls.toString(),
                    eventStartDate1: moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                });

                var inserscrollableevents = scrollableevents.insert({
                    "_id": ls.toString(),
                    "eventName": xData.projectName + ":" + xData.eventName + ", " + "@" + xData.domainName,
                    "domainId": xData.domainId,
                    "eventStartDate": xData.eventStartDate,
                    "eventEndDate": xData.eventEndDate,
                    "eventStartDate1": moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                    "eventEndDate1": moment(new Date(xData.eventEndDate)).format("YYYY-MM-DD"),
                    "offset": new Date().getTimezoneOffset(),
                    "offsetOfDomain": timeZoneOffset,
                    "timeZoneName": timeZoneNames

                });
                var insertMyUpEvents = myUpcomingEvents.insert({
                    "_id": ls.toString(),
                    "tournamentId": ls.toString(),
                    eventName: xData.eventName,
                    projectId: xData.projectId,
                    projectName: xData.projectName,
                    eventStartDate: xData.eventStartDate,
                    eventEndDate: xData.eventEndDate,
                    eventSubscriptionLastDate: xData.eventSubscriptionLastDate,
                    domainId: xData.domainId,
                    domainName: xData.domainName,
                    eventOrganizer: xData.eventOrganizer,
                    "eventStartDate1": moment(new Date(xData.eventStartDate)).format("YYYY-MM-DD"),
                    "eventEndDate1": moment(new Date(xData.eventEndDate)).format("YYYY-MM-DD"),
                })
            }
            if (ls) {
                var eventIdArr = []
                for (var i = 0; i < xData.subEvents.length; i++) {
                    var projectType = tournamentEvents.findOne({
                        "projectSubName._id": xData.subEvents[i].eventId
                    }, {
                        fields: {
                            "projectSubName.$": 1
                        }
                    });
                    var eventId = events.insert({
                        "eventName": xData.subEvents[i].eventName,
                        "projectId": [xData.subEvents[i].eventId],
                        "eventStartDate": xData.subEvents[i].eventStartDate,
                        "eventEndDate": xData.subEvents[i].eventEndDate,
                        "eventSubscriptionLastDate": xData.eventSubscriptionLastDate,
                        "domainId": xData.domainId,
                        "eventSubId": xData.subEvents[i].eventId + ls.toString(),
                        //"subDomain1Name":xData.subDomain1Name,
                        //"subDomain2Name":xData.subDomain2Name,
                        "abbName": projectType.projectSubName[0].abbName,
                        "prize": xData.subEvents[i].prize.toString().replace(/^0+(?!\.|$)/, ''),
                        "projectType": xData.subEvents[i].projectType,
                        //"prizePdfId":xData.prizePdfId,
                        "eventOrganizer": xData.eventOrganizer,
                        "description": xData.description,
                        "sponsorPdf": xData.sponsorPdf,
                        "sponsorLogo": xData.sponsorLogo,
                        "sponsorUrl": xData.sponsorUrl,
                        "sponsorMailId": xData.sponsorMailId,
                        "rulesAndRegulations": xData.rulesAndRegulations,
                        "domainName": xData.domainName,
                        "projectName": xData.projectName,
                        "venueLatitude": xData.venueLatitude,
                        "venueLongitude": xData.venueLongitude,
                        "venueAddress": xData.venueAddress,
                        "eventStartDate1": moment(new Date(xData.subEvents[i].eventStartDate)).format("YYYY-MM-DD"),
                        "eventEndDate1": moment(new Date(xData.subEvents[i].eventEndDate)).format("YYYY-MM-DD"),
                        "eventSubscriptionLastDate1": moment(new Date(xData.eventSubscriptionLastDate)).format("YYYY-MM-DD"),
                        "offsetOfDomain": timeZoneOffset,
                        "timeZoneName": timeZoneNames,
                        "timezoneIdEventLat": xData.timezoneIdEventLat,
                        "timezoneIdEventLng": xData.timezoneIdEventLng,
                        "tournamentEvent": false,
                        "tournamentId": ls.toString(),
                        "offset": new Date().getTimezoneOffset(),
                        "tournamentType":xData.schoolType,
                        "stateAssocId":stateID
                    });
                    var k = events.update({
                        "_id": ls.toString()
                    }, {
                        $push: {
                            "eventsUnderTournament": eventId.toString() + ""
                        }
                    });
                    var jk = events.update({
                        "_id": ls.toString()
                    }, {
                        $push: {
                            "eventsProjectIdUnderTourn": xData.subEvents[i].eventId.toString() + ""
                        }
                    });
                    var lj = myUpcomingEvents.update({
                        "tournamentId": ls.toString()
                    }, {
                        $push: {
                            "eventsUnderTournament": eventId.toString() + ""
                        }
                    })
                }
                eventFeeSettingsInsert(ls.toString(), touProjectId);
                if (findUserRole.role == "Academy" || findUserRole.role == "Association" || findUserRole.role == "Organiser") {
                    insertSubscriptionRestrictions(xData, subscribRest, ls.toString());
                }

            }
            if (ls) {
                saveFilterDateOfBirth(LdataToSaveFromDOB, ls.toString())
            }
            return ls;
        } catch (e) {
            return e;
        }
    }
});

var eventFeeSettingsInsert = function(tournamentId, touProjectId) {
    try {

        var eventFeeSettingsFind = eventFeeSettings.findOne({
            "tournamentId": tournamentId,
        });
        var arra = {};
        events.find({
            "tournamentId": tournamentId
        }).map(function(doc) {
            arra[doc.abbName] = doc.prize.toString().replace(/^0+(?!\.|$)/, '');
        });

        var arraSingle = {}
        events.find({
            "tournamentId": tournamentId,
            projectType: 1
        }).map(function(doc) {
            arraSingle[doc.abbName] = doc.prize.toString().replace(/^0+(?!\.|$)/, '');
        });

        var arraTeam = {}
        events.find({
            "tournamentId": tournamentId,
            projectType: {
                $ne: 1
            }
        }).map(function(doc) {
            arraTeam[doc.abbName] = doc.prize.toString().replace(/^0+(?!\.|$)/, '');
        });
        var findOrder = tournamentEvents.findOne({
            "_id": touProjectId.toString()
        });
        if (findOrder) {
            if (findOrder && findOrder.categoryOrder) {
                var key = findOrder.categoryOrder;
                var k = JSON.parse(JSON.stringify(arra, key, 18));

                var key1 = findOrder.singleEventsOrder;
                var k1 = JSON.parse(JSON.stringify(arraSingle, key1, 18));

                var key2 = findOrder.teamEventsOrder;
                var k2 = JSON.parse(JSON.stringify(arraTeam, key2, 18));

                arra["events"] = _.keys(k);
                arra["eventFees"] = _.values(k);

                arraSingle["events"] = _.keys(k1);
                arraSingle["eventFees"] = _.values(k1);

                arraTeam["events"] = _.keys(k2);
                arraTeam["eventFees"] = _.values(k2);


                if (eventFeeSettingsFind) {
                    eventFeeSettings.update({
                        "tournamentId": tournamentId
                    }, {
                        $set: {
                            events: arra["events"],
                            eventFees: arra["eventFees"],
                            singleEvents: arraSingle["events"],
                            singleEventFees: arraSingle["eventFees"]
                        }
                    })
                } else {
                    eventFeeSettings.insert({
                        "tournamentId": tournamentId,
                        events: arra["events"],
                        eventFees: arra["eventFees"],
                        singleEvents: arraSingle["events"],
                        singleEventFees: arraSingle["eventFees"],
                        teamEvents: arraTeam["events"],
                        teamEventFees: arraTeam["eventFees"]
                    });
                }
            }
        }
    } catch (e) {
    }
};


var insertSubscriptionRestrictions = function(xData, subscribRest, touProjectId) {
    try {

        var useFind = Meteor.users.findOne({
            "userId": xData.eventOrganizer
        });
        var selectedIdsrr = [];
        var selectionType;
        if (useFind && useFind.role) {
            if (subscribRest.selectionType == "selfOnly") {
                selectionType = "self";
            } else if (subscribRest.selectionType == "allSub") {
                selectionType = "all"
            } else if (subscribRest.selectionType == "resrictP") {
                selectionType = "restrict"
                if (useFind.role == "Association" && useFind.associationType == "District/City") {
                    var assocDet = associationDetails.findOne({
                        userId: useFind.userId
                    });
                    if (assocDet && assocDet.parentAssociationId !== null && assocDet.parentAssociationId != undefined && assocDet.parentAssociationId !== "other") {
                        associationDetails.find({
                            parentAssociationId: assocDet.parentAssociationId,
                            affiliatedTo: "stateAssociation"
                        }, {
                            fields: {
                                userId: 1
                            }
                        }).fetch().forEach(function(e, i) {
                            selectedIdsrr.push(e.userId)
                        });
                    }
                } else if (useFind.role == "Academy") {
                    var acadDet = academyDetails.findOne({
                        userId: useFind.userId
                    });
                    if (acadDet && acadDet.associationId !== null && acadDet.associationId != undefined && acadDet.associationId !== "other") {
                        academyDetails.find({
                            associationId: acadDet.associationId,
                            $or: [{
                                affiliatedTo: "stateAssociation"
                            }, {
                                affiliatedTo: "districtAssociation"
                            }]
                        }, {
                            fields: {
                                userId: 1
                            }
                        }).fetch().forEach(function(e, i) {
                            selectedIdsrr.push(e.userId)
                        });
                    }
                }
            } else if (subscribRest.selectionType == "pickASSAC") {
                selectionType = "pick"
                selectedIdsrr = subscribRest.selectedIds;
                selectedIdsrr.push(xData.eventOrganizer)
            } else if (subscribRest.selectionType == "allExceptSchool") {
                selectionType = "allExceptSchool";
            } else if (subscribRest.selectionType == "schoolOnly") {
                selectionType = "schoolOnly";
            }

            subscriptionRestrictions.insert({
                tournamentId: touProjectId.toString(),
                eventOrganizerId: xData.eventOrganizer,
                role: useFind.role,
                selectionType: selectionType,
                selectedIds: selectedIdsrr,
                tournamentType:xData.schoolType
            })
        }
    } catch (e) {

    }
}

var saveFilterDateOfBirth = function(LdataToSaveFromDOB, tournamentId) {
    try {

        var eventOrganizer = LdataToSaveFromDOB.eventOrganizer;
        var mainProjectId = LdataToSaveFromDOB.mainProjectId;
        var arrayToSave = LdataToSaveFromDOB.arrayToSave;
        var find = dobFilterSubscribe.findOne({
            eventOrganizer: eventOrganizer,
            mainProjectId: mainProjectId,
            tournamentId: tournamentId
        })
        if (find) {
            dobFilterSubscribe.update({
                eventOrganizer: eventOrganizer,
                mainProjectId: mainProjectId,
                tournamentId: tournamentId
            }, {
                $set: {
                    details: arrayToSave
                }
            })
        } else {
            dobFilterSubscribe.insert({
                eventOrganizer: eventOrganizer,
                mainProjectId: mainProjectId,
                details: arrayToSave,
                tournamentId: tournamentId
            });
        }
    } catch (e) {

    }
}