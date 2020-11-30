import {
    MatchCollectionDB
}
from '../../publications/MatchCollectionDb.js';
import {
    teamMatchCollectionDB
}
from '../../publications/MatchCollectionDbTeam.js';
Meteor.methods({
    "detailsForThisRound": function(tournamentId, eventName, round) {
        try {
            var data = {}
            var s = tournamentSchedule.aggregate([{
			    $match: {
			        "tournamentId": tournamentId
			    }
			}, {
			    $unwind: "$scheduledData"
			}, {
			    $sort: {
			        "scheduledData.dateOfEventMoment": -1
			    }
			}, {
			    $match: {
			        "scheduledData.round": round,
			        "scheduledData.eventName": eventName
			    }
			}, {
			    $project: {
			        "e": "$scheduledData.schedule",
			        u: "$scheduledData.unAssignedMatchNum",
			        m: "$scheduledData.eventName",
			        d: "$selectedDateMoment",
			        ss: "$selectedDate"
			    }
			}, {
			    $sort: {
			        d: 1
			    }
			}])

            if(s && s.length != 0){
            	return s
            }
            else{
            	return []
            }
        } catch (e) {
        }
    }
})

Meteor.methods({
    "unAssignedMatchNumbs": async function(tournamentId, eventName, round, matchNumbers, checkByes) {
        try {
            var data = {}
            var s = tournamentSchedule.aggregate([{
                $match: {
                    "tournamentId": tournamentId
                }
            }, {
                $unwind: "$scheduledData"
            }, {
                $sort: {
                    "scheduledData.dateOfEventMoment": -1
                }
            }, {
                $match: {
                    "scheduledData.round": round,
                    "scheduledData.eventName": eventName
                }
            }, {
                $project: {
                    u: "$scheduledData.unAssignedMatchNum",
                    m: "$scheduledData.matchNumbers",
                    d: "$selectedDateMoment",
                    ss: "$selectedDate"
                }
            }, {
                $sort: {
                    d: -1
                }
            }])
            var r = []
            if (s && s.length != 0 && s[0]) {
                if (s[0].u && s[0].m) {
                    var data = {
                        u: s[0].u.toString(),
                        m: s[0].m.toString()
                    }

                    r.push(data)
                } else {
                    var lUpto = matchNumbers.toString().split("-")
                    var m = []
                    if (lUpto && lUpto[0] && lUpto[1]) {
                        m = _.range(parseInt(parseInt(lUpto[0])), parseInt(parseInt(lUpto[1]) + 1))
                        if (checkByes) {
                            var res = await Meteor.call("getOnlyMatchesWithoutBye", tournamentId, eventName, lUpto)
                            try {
                                if (res) {
                                    m = res
                                } else if (e) {
                                    m = []
                                }
                            }catch(e){
                                m = []
                            }
                        }
                    } else {
                        m = []
                    }
                    var data = {
                        u: "No matches are scheduled",
                        m: m
                    }
                    r.push(data)
                }
            } else {
                var lUpto = matchNumbers.toString().split("-")
                var m = []
                if (lUpto && lUpto[0] && lUpto[1]) {
                    m = _.range(parseInt(parseInt(lUpto[0])), parseInt(parseInt(lUpto[1]) + 1))
                    if (checkByes) {
                        var res = await Meteor.call("getOnlyMatchesWithoutBye", tournamentId, eventName, lUpto)
                        try {
                            if (res) {
                                m = res
                            } else if (e) {
                                m = []
                            }
                        }catch(e){
                            m = []
                        }
                    }
                } else {
                    m = []
                }
                var data = {
                    u: "No matches are scheduled",
                    m: m
                }
                r.push(data)
            }
            return r
        } catch (e) {
        }
    }
})



Meteor.methods({
    "checkForTableNos": function(tablenos, start, end, startDate, tournamentId,duration) {
        try {

        	var data = {
            	res:true
            }
            var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

        	var q = tournamentScheduleTableNos.find({
			    "selectedDate": startDate,
                "tournamentId": tournamentId,
			    "noOfTables": {
			        "$elemMatch": {
			            "$in": tablenos
			        }
			    }
			}).fetch()


        	if (q && q.length != 0) {
        		for (var i = 0; i < q.length; i++) {
        			var time2 =  q[i].starttimesession
                    var end2  = q[i].endtimesession
                    var tochecktab = q[i].noOfTables

                    start = moment(start, ["h:mm:ss A"]).format("HH:mm:ss")
                    end = moment(end, ["h:mm:ss A"]).format("HH:mm:ss")

                    var added = start

				    do {
				     	if(parseInt(added.replace(regExp, "$1$2$3")) >= parseInt(time2.replace(regExp, "$1$2$3"))
				        && parseInt(added.replace(regExp, "$1$2$3")) < parseInt(end2.replace(regExp, "$1$2$3"))){

				            var toret =  "Given table nos are used in session " + 
                        		q[i].sessionNumber + " on " + q[i].starttimesession + "-" + 
                        		q[i].endtimesession

				            data = {
                        		res:false,
                        		toret:toret
                        	}

				            return data
				        }
				        added = moment(new Date(startDate + " " + added)).add(duration, 'minutes').format('HH:mm:ss');
                        data = {
                        	res:true,
                        }
				    }
				    while(added<end);

        		}
        	}
        	return data
        } catch (e) {
        }
    }
})


Meteor.methods({
    "getOnlyMatchesWithoutBye": function(tournamentId, seleventName, lUpto) {
        try {
            var createMatchIds = _.range(parseInt(parseInt(lUpto[0])), parseInt(parseInt(lUpto[1]) + 1))

            var eveDet = events.findOne({
                "tournamentId": tournamentId,
                eventName: seleventName
            })
            var projectType = 0
            var eventId = ""

            if (eveDet && eveDet._id && eveDet.projectType != undefined && eveDet.projectType != null) {
                projectType = eveDet.projectType
                eventId = eveDet._id
            } else {
                eveDet = pastEvents.findOne({
                    "tournamentId": tournamentId,
                    eventName: seleventName
                })
                if (eveDet && eveDet._id && eveDet.projectType != undefined && eveDet.projectType != null) {
                    projectType = eveDet.projectType
                    eventId = eveDet._id
                }
            }


            if (projectType && parseInt(projectType) == 2) {
                var checkForBye = teamMatchCollectionDB.aggregate([{
                    $match: {
                        tournamentId: tournamentId,
                        eventName: seleventName
                    }
                }, {
                    $unwind: "$matchRecords"
                }, {
                    $match: {
                        "matchRecords.matchNumber": {
                            $in: createMatchIds
                        }
                    }
                }, {
                    $project: {
                        m: {
                            "$cond": {
                                "if": {
                                    "$ne": ["$matchRecords.status", "bye"]
                                },
                                "then": "$matchRecords.matchNumber",
                                else: "$noval"
                            }
                        }
                    }
                }, {
                    '$sort': {
                        m: 1
                    }
                }, {
                    $group: {
                        "_id": null,
                        e: {
                            $addToSet: "$m",
                        }
                    }
                }])
                if (checkForBye && checkForBye[0] && checkForBye[0].e) {
                    createMatchIds = checkForBye[0].e
                }
            } else if (projectType && parseInt(projectType) == 1) {
                var checkForBye = MatchCollectionDB.aggregate([{
                    $match: {
                        tournamentId: tournamentId,
                        eventName: seleventName
                    }
                }, {
                    $unwind: "$matchRecords"
                }, {
                    $match: {
                        "matchRecords.matchNumber": {
                            $in: createMatchIds
                        }
                    }
                }, {
                    $project: {
                        m: {
                            "$cond": {
                                "if": {
                                    "$ne": ["$matchRecords.status", "bye"]
                                },
                                "then": "$matchRecords.matchNumber",
                                else: "$noval"
                            }
                        }
                    }
                }, {
                    '$sort': {
                        m: 1
                    }
                }, {
                    $group: {
                        "_id": null,
                        e: {
                            $addToSet: "$m",
                        }
                    }
                }])
                if (checkForBye && checkForBye[0] && checkForBye[0].e) {
                    createMatchIds = checkForBye[0].e
                }
            }
            return _.sortBy(createMatchIds, function(num) {
                return parseInt(num);
            });
        } catch (e) {
        }
    }
})


Meteor.methods({
    "getSessionDetails": function(tournamentId,startDate) {
        try {

            if (tournamentId && startDate) {
                var s = tournamentScheduleTableNos.find({
                    "tournamentId": tournamentId
                },{
                	sort:{
                		selectedDateMoment:1,
                		sessionNumber:1
                	}
                }).fetch()
                if(s && s.length){
                	return s
                }
                else{
                	return []
                }
            }

        } catch (e) {
        }
    }
})