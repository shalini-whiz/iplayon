import {
    emailRegex
}
from '../dbRequiredRole.js'

import {
    playerDBFind
}
from '../dbRequiredRole.js'
//userDetailsTTUsed
Meteor.methods({
    "myeventsUnderTournHelper": function(xData) {
        try {
            check(xData, String)
            var s = events.findOne({
                "_id": xData
            });
            if (s == undefined) {
                s = pastEvents.findOne({
                    "_id": xData
                });
            }
            return s.eventName;
        } catch (e) {}
    }
});
Meteor.methods({
    "myeventsSubscribedUnderTournHelper": function(xData) {
        try {
            check(xData, String)
            var s = events.findOne({
                "_id": xData,
                eventParticipants: {
                    $in: [Meteor.userId()]
                }
            });
            if (s == undefined) {
                s = pastEvents.findOne({
                    "_id": xData,
                    eventParticipants: {
                        $in: [Meteor.userId()]
                    }
                });
            }
            return s.eventName;
        } catch (e) {}
    }
});
Meteor.methods({
    "myeventsTournaments": function(xData) {
        try {
            check(xData, String)
            var s = events.findOne({
                "_id": xData
            });
            if (s == undefined) {
                s = pastEvents.findOne({
                    "_id": xData
                });
            }
            return s;
        } catch (e) {}
    }
});

Meteor.methods({
    "organizerName": function(org) {
        try {

            check(org, String)
            var findWho = Meteor.users.findOne({
                "_id": org
            })
            if (findWho) {
                return findWho
            } else return undefined
        } catch (e) {}
    }
});

Meteor.methods({
    "DomainName": function(org) {
        try {

            check(org.toString(), String)
            var domainName = domains.findOne({
                "_id": org.toString()
            });
            if (domainName) {
                return domainName
            } else return undefined
        } catch (e) {}
    }
});


Meteor.methods({
    "findWho": function(org) {
        try {

            check(org, String)
            var findWho = Meteor.users.findOne({
                "_id": org,
                "role": "Association",
                "associationType": "State/Province/County"
            })
            if (findWho) {
                return findWho
            } else return undefined
        } catch (e) {}
    }
})

Meteor.methods({
    "findWho2": function(org) {
        try {

            check(org, String)
            var findWho = Meteor.users.findOne({
                "_id": org,
                "role": "Association"
            })
            if (findWho) {
                return findWho
            } else return undefined
        } catch (e) {}
    }
});

Meteor.methods({
    "findDetailsUsers": function(userId) {
        try {

            check(userId, String)
            var findWho = Meteor.users.findOne({
                "_id": userId
            })
            if (findWho) {
                return findWho
            }
        } catch (e) {}
    }
});


Meteor.methods({
    "eventSubLastUnderTournHelper": function(xData,checkForOrganizer) {
        try {
            check(xData, String)
            if(checkForOrganizer){
                checkForOrganizer = checkForOrganizer
            }
            else{
                checkForOrganizer = false
            }
            

            var jsonSaa = "";

            var ldata = events.findOne({
                "tournamentEvent": true,
                "_id": xData
            });

            
            if (ldata) {
                if(checkForOrganizer==false){
                    if (moment(moment(ldata.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(ldata.timeZoneName).format("YYYY-MM-DD"))) {
                        return true
                    } else {
                        return false
                    }
                } else if(checkForOrganizer==true && this.userId && ldata.eventOrganizer==this.userId){
                    return true
                }  else{
                    return false
                }
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
});

Meteor.methods({
    "eventSubLastUnderTournHelper_past": function(xData) {
        try {

            check(xData, String)

            var jsonSaa = "";
            var ldata = events.findOne({
                "tournamentEvent": true,
                "_id": xData
            });
            if (ldata == undefined) {
                ldata = pastEvents.findOne({
                    tournamentEvent: true,
                    "_id": xData
                })
            }
            if (ldata) {
                if (moment(moment(ldata.eventSubscriptionLastDate1).format("YYYY-MM-DD")) >= moment(moment.tz(ldata.timeZoneName).format("YYYY-MM-DD"))) {
                    return true
                } else return false
            } else {
                return false
            }
        } catch (e) {}
    }
});

Meteor.methods({
    "findWho_ForgotPAss": function(emailId) {
        try {

            check(emailId, String)
            var findWho = Meteor.users.findOne({
                $or: [{
                    "emailAddress": {
                        $regex: emailRegex(emailId)
                    },
                    "emails.0.address": {
                        $regex: emailRegex(emailId)
                    }
                }]
            })
            if (findWho) {
                return findWho
            } else return undefined
        } catch (e) {}
    }
});

Meteor.methods({
    "abbrevationDuplicates": function(abbName) {
        try {

            check(abbName, String)
            var findWho = Meteor.users.findOne({
                $or: [{
                    'abbrevationAssociation': abbName.toUpperCase()
                }, {
                    'abbrevationAcademy': abbName.toUpperCase()
                }]
            })
            if (findWho) {
                return findWho
            } else return undefined
        } catch (e) {}
    }
});

Meteor.methods({
    "findWho_ForExis": function(emailId) {
        try {

            check(emailId, String)
            var findWho = Meteor.users.findOne({
                $or: [{
                    "emailAddress": {
                        $regex: emailRegex(emailId)
                    },
                    "emails.0.address": {
                        $regex: emailRegex(emailId)
                    }
                }]
            })
            if (findWho) {
                return findWho
            } else {
                return false
            }
        } catch (e) {}
    }
});

//to use
Meteor.methods({
    'whichClubORAssocName': function(Id) {
        try {

            check(Id, String)
            if (Id) {
                var toret = "userDetailsTT"
                var usersMet = Meteor.users.findOne({
                    userId: Id
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }

                var find = global[toret].findOne({
                    "userId": Id
                });

                if (find && find.affiliatedTo) {
                    if (find.affiliatedTo == "academy" && find.clubNameId) {
                        var v = academyDetails.findOne({
                            "userId": find.clubNameId
                        })
                        if (v && v.clubName)
                            return v.clubName;
                    } else if (find.affiliatedTo == "stateAssociation" && find.associationId) {
                        var v = associationDetails.findOne({
                            "userId": find.associationId
                        })
                        if (v && v.associationName)
                            return v.associationName;
                    } else if (find.affiliatedTo == "districtAssociation" && find.associationId) {
                        var v = associationDetails.findOne({
                            "userId": find.associationId
                        })
                        if (v && v.associationName)
                            return v.associationName
                    }
                }
            }
        } catch (e) {}
    }
})

Meteor.methods({
    'whoisEventOrganizer': function(Id) {
        try {

            check(Id, String)
            if (Id) {
                var eveOrg;
                var toret = "userDetailsTT"
                var usersMet = Meteor.users.findOne({
                    userId: Id
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }


                eveOrg = global[toret].findOne({
                    "userId": Id
                });
                if (eveOrg == undefined) {
                    eveOrg = academyDetails.findOne({
                        "userId": Id
                    });
                    if (eveOrg == undefined) {
                        eveOrg = associationDetails.findOne({
                            "userId": Id
                        })
                        if (eveOrg == undefined) {
                            eveOrg = otherUsers.findOne({
                                "userId": Id
                            })
                        }
                    }
                }
                if (eveOrg != undefined)
                    return eveOrg;
                else return false
            }
        } catch (e) {}
    }
});


Meteor.methods({
    'eventAbbrevationsNAMES': function(Id) {
        try {

            check(Id, String)
            if (Id) {
                var eveOrg;
                eveOrg = eventFeeSettings.findOne({
                    "tournamentId": Id
                });

                if (eveOrg !== undefined)
                    return eveOrg.events;
                else return false
            }
        } catch (e) {}
    }
});

Meteor.methods({
    'eventAbbrevationsNAMESSeparatedEvents': function(Id) {
        try {

            check(Id, String)
            if (Id) {
                var eveOrg;
                eveOrg = eventFeeSettings.findOne({
                    "tournamentId": Id
                });

                if (eveOrg !== undefined)
                    return eveOrg.singleEvents;
                else return false
            }
        } catch (e) {}
    }
});

/*Meteor.methods({
    "scrollableeventsLIST":function(){
        try{
        check(xData,String)
        }catch(e){}
        var jsonSaa=[];


        //var lUserId = Meteor.users.findOne({"_id":this.userId});
        //if(lUserId!=undefined){
        var ldata = scrollableevents.find({
        }).fetch().forEach(function(e,i){
            if(moment(e.eventStartDate1).format("YYYY-MM-DD hh:mm")>moment.tz(e.timeZoneName).format()){
                e.type=1;
                jsonSaa.push(e)
            }
            else if(e.eventEndDate1>=moment.tz(e.timeZoneName).format()&&e.eventStartDate1<=moment.tz(e.timeZoneName).format()){
                e.type=0;
                jsonSaa.push(e)
            }
        //});
       // }
        if(jsonSaa){
            return jsonSaa
        }
    }
});*/


Meteor.methods({
    "testOnLogin": function() {
        try {
            var l = events.find({
                tournamentEvent: true,
                _id:{
                    "$ne":"livelinks_11sports"
                }
            }, {
                sort: {
                    eventEndDate1: 1
                }
            }).fetch();
            for (var i = 0; i < l.length; i++) {
                var e = l[i];
                if (e.timeZoneName) {
                    if (pastEvents.findOne({
                            "_id": e._id
                        }) == undefined) {
                        if (moment(moment(new Date(e.eventEndDate1)).format("YYYY-MM-DD")) < moment(moment.tz(e.timeZoneName).format("YYYY-MM-DD"))) {
                            pastEvents.insert(e);
                            if (myPastEvents.findOne({
                                    "_id": e._id
                                }) == undefined) {
                                myPastEvents.insert({
                                    "_id": e._id,
                                    "tournamentId": e._id.toString(),
                                    eventName: e.eventName,
                                    projectId: e.projectId,
                                    projectName: e.projectName,
                                    eventStartDate: e.eventStartDate,
                                    eventEndDate: e.eventEndDate,
                                    eventSubscriptionLastDate: e.eventSubscriptionLastDate,
                                    domainId: e.domainId,
                                    domainName: e.domainName,
                                    eventOrganizer: e.eventOrganizer,
                                    eventsUnderTournament: e.eventsUnderTournament,
                                    "eventStartDate1": moment(new Date(e.eventStartDate)).format("YYYY-MM-DD"),
                                    "eventEndDate1": moment(new Date(e.eventEndDate)).format("YYYY-MM-DD"),
                                });
                            }

                            events.remove(e);
                            myUpcomingEvents.remove({
                                tournamentId: e._id
                            });
                            scrollableevents.remove({
                                "_id": e._id
                            })
                            events.find({
                                "tournamentId": e._id
                            }).fetch().forEach(function(eve, i) {

                                if (pastEvents.findOne({
                                        "_id": eve._id
                                    }) == undefined) {
                                    pastEvents.insert(eve)
                                    events.remove(eve)
                                }

                            })
                        } else {
                            break;
                        }
                    }
                }
            }
        } catch (e) {}
    }
});


Meteor.methods({
    "findWho_RestSubscription": function(org) {
        try {

            check(org, String)
            var findWho = Meteor.users.findOne({
                "_id": org
            });
            //for da
            if (findWho && findWho.role == "Association") {
                var assocFind = associationDetails.findOne({
                    "userId": org,
                    associationType: "District/City",
                    affiliatedTo: {
                        $nin: ["other", null, undefined]
                    }
                });
                if (assocFind)
                    return assocFind
            }
            //for sa
            if (findWho && findWho.role == "Association") {
                var assocFind = associationDetails.findOne({
                    "userId": org,
                    associationType: "State/Province/County"
                });
                if (assocFind)
                    return assocFind
            }
            //for aca
            else if (findWho && findWho.role == "Academy") {
                var assocFind = academyDetails.findOne({
                    "userId": org,
                    affiliatedTo: {
                        $nin: ["other", null, undefined]
                    }
                });
                if (assocFind)
                    return assocFind
            }
            //for Play
            else if (findWho && findWho.role == "Player") {
                var toret = "userDetailsTT"
                var usersMet = Meteor.users.findOne({
                    userId: Id
                })

                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }

                var assocFind = global[toret].findOne({
                    "userId": org
                });
                
                if (assocFind)
                    return assocFind
            }
            //for other 
            else if (findWho && findWho.role !== "Player" && findWho.role !== "Academy" && findWho.role !== "Association") {
                var assocFind = otherUsers.findOne({
                    "userId": org
                });
                if (assocFind)
                    return assocFind
            } else return undefined
        } catch (e) {}
    }
});

Meteor.methods({
    "subscriptionRestrictionsFind": function(tournamentId, eventOrganizerId) {
        try {

            check(tournamentId, String);
            check(eventOrganizerId, String);
            var subDetails = subscriptionRestrictions.findOne({
                tournamentId: tournamentId,
                eventOrganizerId: eventOrganizerId
            });
            if (subDetails) {
                return subDetails
            } else {
                var userRole = Meteor.users.findOne({
                    "userId": eventOrganizerId
                });
                if (userRole && userRole.role == "Organiser") {
                    var data = {
                        selectionType: "allExceptSchool",
                        selectedIds: []
                    }
                    return data
                } else if (userRole) {
                    var data = {
                        selectionType: "all",
                        selectedIds: []
                    }
                    return data
                }
            }
        } catch (e) {}
    }
})



/*Meteor.methods({
    "getUpdatedateEvents":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
                var eve=events.find({$or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                projectId: {
                    $in:lUserId[0].interestedProjectName
                },
                tournamentEvent:true
         }).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeZone.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')>=moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});


Meteor.methods({
    "getUpdatedateEventsEventNameSort":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
                var eve=events.find({$or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                projectId: {
                    $in:lUserId[0].interestedProjectName
                },
                tournamentEvent:true
         }, {sort:{eventName:1}}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeZone.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')>=moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});


Meteor.methods({
    "getUpdatedateEventsDomainNameSort":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
                var eve=events.find({$or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                projectId: {
                    $in:lUserId[0].interestedProjectName
                },
                tournamentEvent:true
         }, {sort:{domainName:1}}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeZone.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')>=moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});

Meteor.methods({
    "getUpdatedateEventsEventStartDateSort":function(){
var jsonS = []
lUserId = Meteor.users.find({"_id":Meteor.userId()}).fetch();
                var eve=events.find({$or: [{
                    domainId: {
                        $in: lUserId[0].interestedDomainName
                    }
                }, {
                    subDomain1Name: {
                        $in: lUserId[0].interestedSubDomain1Name
                    }
                }, {
                    subDomain2Name: {
                        $in: lUserId[0].interestedSubDomain2Name
                    }
                }],
                projectId: {
                    $in:lUserId[0].interestedProjectName
                },
                tournamentEvent:true
         }, {sort:{eventStartDate1:1}}).fetch().forEach(function(lEvents,i){
                    var getCountryId = timeZone.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')>=moment(nowing*1000).startOf('day')){
                    jsonS.push(lEvents)
                    }
                    else{
                    }
                })
return jsonS
    }
});*/


/*Meteor.methods({
    "eventsUnderTournHelper":function(xData){
        
        try{
        check(xData,String)
        }catch(e){}
        var jsonSaa="";
        var s = events.find({"_id":xData}).forEach(function(lEvents,i){
                    var getCountryId = timeZone.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')>=moment(nowing*1000).startOf('day')){
                        jsonSaa=lEvents.eventName
                        //return true
                    }
                    else{
                        jsonSaa=false
                        //return false
                        
                    }
                })
return jsonSaa;
    }
});

//my events
Meteor.methods({
    "myeventsUnderTournHelper":function(xData){
        
        try{
        check(xData,String)
        }catch(e){}
        var jsonSaa="";
        var s = events.find({"_id":xData}).forEach(function(lEvents,i){
                    var getCountryId = timeZone.findOne({
                         "state": { $elemMatch: { "stateId": lEvents.domainId.toString() } }
                        });
                    var uf = moment.utc(getCountryId.timeStamp*1000).format("YYYY/DD/MMM")// hh:mm a");
                    var uf1 = new Date(uf).getTime()/1000;
                    var d1 = moment(getCountryId.timeStampUpdatedDate).format();
                    var diff = Math.abs(new Date(d1) - new Date());
                    var diffh = (diff/1000)
                    var now = new Date(uf1*1000);
                    now.setSeconds(now.getSeconds() + diffh);
                    var nowing = new Date(now).getTime()/1000;
                    var dateT2 = (new Date(lEvents.eventEndDate1)).getTime()/1000;
                    var uf4 = moment.utc(dateT2*1000).offset(lEvents.offset).format("YYYY/DD/MMM")// hh:mm a");
                    var uf5 = new Date(uf4).getTime()/1000;
                    if(moment(uf5*1000).startOf('day')>=moment(nowing*1000).startOf('day')){
                        jsonSaa=lEvents.eventName
                        //return true
                    }
                    else{
                        jsonSaa=lEvents.eventName
                        //return false
                        
                    }
                })
return jsonSaa;
    }
});*/

Meteor.methods({
    "findDetailsUsersTeams": function(userId) {
        try {
            check(userId, String)
            var findWho = Meteor.users.findOne({
                "_id": userId
            })
            if (findWho) {
                return findWho
            } else if (findWho == undefined) {
                findWho = schoolPlayers.findOne({
                    userId: userId
                })
                if (findWho == undefined) {
                    findWho = playerTeams.findOne({
                        "_id": userId
                    })

                    if (findWho == undefined) {
                        findWho = schoolTeams.findOne({
                            "_id": userId
                        })
                        if (findWho) {
                            return findWho
                        }
                    } else {
                        return findWho
                    }
                } else {
                    return findWho
                }
            }
        } catch (e) {}
    }
});