import {
    emailRegex
}
from '../../methods/dbRequiredRole.js'

import {
    playerDBFind
}
from '../../methods/dbRequiredRole.js'
//userDetailsTTUsed

Meteor.publish('usersOther_TT', function() {
    var lData;
    if (this.userId !== undefined) {
        var userId = Meteor.users.findOne({
            "_id": this.userId
        })
        if (userId != undefined && (userId.role == "Association" || userId.role == "Academy")) {
            if (userId.interestedProjectName && userId.interestedProjectName.length != 0) {
                var toret = playerDBFind(userId.interestedProjectName[0])
                if (toret) {
                    lData = global[toret].find({
                        "affiliatedTo": "other"
                    });
                    if (lData != undefined) {
                        return lData;
                    }
                }
            } else return this.ready();
        }
    } else return this.ready();
});

Meteor.publish('usersAffiliatedTo', function(skipCount) {
    var lData;
    if (this.userId != undefined) {
        var loggedIn = Meteor.users.findOne({
            "_id": this.userId
        });
        if (loggedIn && loggedIn.userId) {
            if (loggedIn.interestedProjectName && loggedIn.interestedProjectName.length) {
                var toret = playerDBFind(loggedIn.interestedProjectName[0])
                if (toret) {

                    if (loggedIn.role && loggedIn.role == "Academy") {
                        Counts.publish(this, 'userDetailsTTCOunt', global[toret].find({
                            "clubNameId": loggedIn.userId,
                            affiliatedTo: "academy"
                        }), {
                            noReady: true
                        });
                        lData = global[toret].find({
                            "clubNameId": loggedIn.userId,
                            affiliatedTo: "academy"
                        }, {
                            sort: {
                                dateOfBirth: -1
                            },
                            limit: 10, // records to show per page
                            skip: skipCount
                        });
                    } else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {

                        Counts.publish(this, 'userDetailsTTCOunt', global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "stateAssociation"
                        }), {
                            noReady: true
                        });
                        lData = global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "stateAssociation"
                        }, {
                            sort: {
                                dateOfBirth: -1
                            },
                            limit: 10, // records to show per page
                            skip: skipCount
                        });
                    } else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City") {

                        Counts.publish(this, 'userDetailsTTCOunt', global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "districtAssociation"
                        }), {
                            noReady: true
                        });
                        lData = global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "districtAssociation"
                        }, {
                            sort: {
                                dateOfBirth: -1
                            },
                            limit: 10, // records to show per page
                            skip: skipCount
                        });

                    }
                }
            }
        }
        return lData;
    }
});

Meteor.publish('usersAffiliatedToSearch_Player', function(searchValue, skipCount) {
    var lData;
    var reObj = new RegExp(searchValue.trim(), 'i');
    if (this.userId != undefined) {
        var loggedIn = Meteor.users.findOne({
            "_id": this.userId
        });
        if (loggedIn && loggedIn.userId) {
            if (loggedIn.interestedProjectName && loggedIn.interestedProjectName.length) {
                var toret = playerDBFind(loggedIn.interestedProjectName[0])
                if (toret) {
                    if (loggedIn.role && loggedIn.role == "Academy") {

                        Counts.publish(this, 'userDetailsTTCOunt', global[toret].find({
                            "clubNameId": loggedIn.userId,
                            affiliatedTo: "academy",
                            userName: {
                                $regex: reObj
                            },
                        }), {
                            noReady: true
                        });
                        lData = global[toret].find({
                            "clubNameId": loggedIn.userId,
                            affiliatedTo: "academy",
                            userName: {
                                $regex: reObj
                            },
                        }, {
                            sort: {
                                dateOfBirth: -1
                            },
                            limit: 10, // records to show per page
                            skip: skipCount
                        });
                    } else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "State/Province/County") {

                        Counts.publish(this, 'userDetailsTTCOunt', global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "stateAssociation",
                            userName: {
                                $regex: reObj
                            },
                        }), {
                            noReady: true
                        });
                        lData = global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "stateAssociation",
                            userName: {
                                $regex: reObj
                            },
                        }, {
                            sort: {
                                dateOfBirth: -1
                            },
                            limit: 10, // records to show per page
                            skip: skipCount
                        });
                    } else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City") {

                        Counts.publish(this, 'userDetailsTTCOunt', global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "districtAssociation",
                            userName: {
                                $regex: reObj
                            },
                        }), {
                            noReady: true
                        });
                        lData = global[toret].find({
                            associationId: loggedIn.userId,
                            affiliatedTo: "districtAssociation",
                            userName: {
                                $regex: reObj
                            },
                        }, {
                            sort: {
                                dateOfBirth: -1
                            },
                            limit: 10, // records to show per page
                            skip: skipCount
                        });

                    }
                }
            }
        }
        return lData;
    }
});

Meteor.publish(
    "findBYEmail",
    function(emailId) {
        check(emailId, String)
        try {
            if (emailId.trim().length != 0) {
                var reObj = new RegExp(emailId.trim(), 'i');
                var findWho = Meteor.users.find({
                    'emails.0.address': {
                        $regex: emailRegex(emailId)
                    }
                })
                if (findWho) {
                    return findWho
                } else return undefined
            }
        } catch (e) {

        }
    }
);

Meteor.publish(
    "onlyLoggedInALLRoles",
    function() {
        if (this.userId) {
            var findWho = Meteor.users.findOne({
                "_id": this.userId
            });
            if (findWho && findWho.role == "Association") {
                return associationDetails.find({
                    "userId": this.userId
                })
            } else if (findWho && findWho.role == "Academy") {
                return academyDetails.find({
                    "userId": this.userId
                })
            } else if (findWho && findWho.role == "Player") {
                var usersMet = Meteor.users.findOne({
                    userId: this.userId
                })
                var toret = "userDetailsTT"
                
                if (usersMet && usersMet.interestedProjectName && usersMet.interestedProjectName.length) {
                    var dbn = playerDBFind(usersMet.interestedProjectName[0])
                    if (dbn) {
                        toret = dbn
                    }
                }

                return global[toret].find({
                    "userId": this.userId
                })
            } else if (findWho.role == "Umpire" || findWho.role == "Coach" || findWho.role == "Organiser" || findWho.role == "Other" || findWho.role == "Journalist") {
                return otherUsers.find({
                    "userId": this.userId
                })
            }
        }
    }
);

Meteor.methods({
    "playersCountSubAggre":function(userId){
        try{
            var loggedIn = Meteor.users.findOne({
                "_id": userId
            })

            var query = {}
            var toret = false

            if (loggedIn && loggedIn.userId) {
                if (loggedIn.role && (loggedIn.role == "Association") && 
                loggedIn.associationType == "State/Province/County" 
                && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "$or": [{
                            "associationId": loggedIn.userId
                        }, {
                            "parentAssociationId": loggedIn.userId,
                        }],
                        /*$and:[
                              {"affiliationId":{$nin:[null,"","other"]}},
                              {"statusOfUser":"Active"}
                        ]*/
                    }
                }
                else if(loggedIn.role && loggedIn.role == "Academy" && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "clubNameId": loggedIn.userId
                    }
                }
                else if(loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City"
                    && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "associationId": loggedIn.userId
                    }
                }

                if(toret){
                    var count = global[toret].find(
                        query
                    ).fetch()

                    if(count && count.length){
                        return count.length
                    }
                    else{
                        return 0
                    }
                }
                else{
                    return 0
                }
            }
            
            return 0
        }catch(e){
        }
    }
})



Meteor.methods({
    playersSubAggregate:function(skipCount,userId){
        try{
            var players = []
           
            var loggedIn = Meteor.users.findOne({
                "_id": userId
            })

            var query = {}
            var toret = false

            if (loggedIn && loggedIn.userId) {
                if (loggedIn.role && (loggedIn.role == "Association") && 
                loggedIn.associationType == "State/Province/County" 
                && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "$or": [{
                            "associationId": loggedIn.userId
                        }, {
                            "parentAssociationId": loggedIn.userId,
                        }],
                        /*$and:[
                              {"affiliationId":{$nin:[null,"","other"]}},
                              {"statusOfUser":"Active"}
                        ]*/
                    }
                }
                else if(loggedIn.role && loggedIn.role == "Academy" && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "clubNameId": loggedIn.userId
                    }
                }
                else if(loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City"
                    && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "associationId": loggedIn.userId
                    }
                }

                if(toret){    
                    players = global[toret].find(
                        query, {
                        sort: {
                            dateOfBirth: -1
                        },
                        limit: 10, // records to show per page
                        skip: parseInt(skipCount * 10)
                    }).fetch();
                }
            }
            return players
        }catch(e){
        }
    }
})

Meteor.publish('givenUserDetUserId',function(dbName,userId){
    try{
        if(dbName){
            var s = global[dbName].find({
                userId:userId
            })
            if(s){
                return s
            }
        }
    }catch(e){
    }
})

Meteor.methods({
      "playersCountSubAggre_temp":function(userId){
        try{
            var loggedIn = Meteor.users.findOne({
                "_id": userId
            })

            var query = {}
            var toret = false

            if (loggedIn && loggedIn.userId) {
                if (loggedIn.role && (loggedIn.role == "Association") && 
                loggedIn.associationType == "State/Province/County" 
                && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "$or": [{
                            "associationId": loggedIn.userId
                        }, {
                            "parentAssociationId": loggedIn.userId,
                        }],
                      
                    }
                }
                else if(loggedIn.role && loggedIn.role == "Academy" && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "clubNameId": loggedIn.userId
                    }
                }
                else if(loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City"
                    && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0){
                    toret = playerDBFind(loggedIn.interestedProjectName[0])
                    query = {
                        "role": "Player",
                        "associationId": loggedIn.userId
                    }
                }

                if(toret){
                    var count = global[toret].aggregate([{
                        $match: query
                    }, {
                        $count: "userId"
                    }])

                    if(count && count[0] && count[0].userId){
                        return count[0].userId
                    }
                    else if(count && count.userId){
                        return count.userId
                    }
                }
                else{
                    return 0
                }
            }
            
            return 0
        }catch(e){
            return e;
        }
    },
    rankFilters_temp: function(playerID) {
        try {
            var userInfo = Meteor.users.findOne({
                "userId": playerID
            });
            var jsonS = {};

            if (userInfo != undefined) {

                var sportsUniq = tournamentEvents.aggregate([

                    {
                        $unwind: "$projectSubName"
                    }, {
                        $match: {
                            "projectSubName.projectType": {
                                $nin: ["2"]
                            }
                        }
                    },

                    {
                        $group: {
                            "_id": {
                                "sportId": "$_id",
                                "projectMainName": "$projectMainName"
                            },
                            "events": {
                                $addToSet: "$projectSubName.projectName"
                            },
                        }
                    }, {
                        $project: {
                            "sportID": "$_id.sportId",
                            "sport": "$_id.projectMainName",
                            "events": 1,
                            "_id": 0
                        }
                    }

                ]);


                var organizerUniq = PlayerPoints.aggregate([{
                        $group: {
                            "_id": {
                                "organizerId": "$organizerId",
                                "sportId": "$sportId"
                            },

                        }
                    }, {
                        $project: {
                            "organizerId": "$_id.organizerId",
                            "sportId": "$_id.sportId",
                            "_id": 0
                        }
                    }, {
                        $lookup: {
                            from: "users",
                            localField: "organizerId",
                            foreignField: "userId",
                            as: "userDetails"
                        }
                    }, {
                        $unwind: "$userDetails"
                    }, {
                        $project: {
                            "organizerId": 1,
                            "sportId": 1,
                            "organizerName": "$userDetails.userName",
                        }
                    }

                ]);

                jsonS["sports"] = sportsUniq;
                jsonS["organizer"] = organizerUniq;

            }
            return jsonS;
        } catch (e) {
            return e;
        }
    },

})

Meteor.methods({
    userFoundSub:function(userId,tournId){
        try{
            var players = []
            if(tournId){
                var s = events.findOne({
                    "_id":tournId
                })
                if(s && s.projectId && s.projectId[0]){
                    var toret = playerDBFind(s.projectId[0])
                    if(toret){
                        var playeDet = global[toret].findOne({
                            userId:userId
                        })
                        if(playeDet){
                            return playeDet
                        }
                    }
                }
            }
            
        }catch(e){
        }
    }
})
Meteor.publish('eventFeeSettingsWithId',function(tournId){
    try{
        var eve = eventFeeSettings.find({
            tournamentId:tournId
        },{
            fields:{
                tournamentId:1,
                singleEvents:1,
                singleEventFees:1,
                events:1
            }
        })
        return eve
    }catch(e){}
})

Meteor.publish('dobFilterSubscribeWithId',function(tournId){
    try{
        var eve = dobFilterSubscribe.find({
            tournamentId:tournId
        })
        return eve
    }catch(e){}
})

Meteor.publish('playersSub', function(skipCount, userId) {
    try{
    var players = []
    var positiveIntegerCheck = Match.Where(function(x) {
        check(x, Match.Integer);
        return x >= 0;
    });
    check(skipCount, positiveIntegerCheck);
    var loggedIn = Meteor.users.findOne({
        "_id": userId
    })
    if (loggedIn && loggedIn.userId) {
        if (loggedIn.role && loggedIn.role == "Academy" && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {

            var toret = playerDBFind(loggedIn.interestedProjectName[0])
            if (toret) {

                Counts.publish(this, 'playersCountforacad', global[toret].find({
                    "role": "Player",
                    "clubNameId": loggedIn.userId,
                }, {
                    sort: {
                        dateOfBirth: -1
                    }
                }), {
                    noReady: true
                });
                players = global[toret].find({
                    "role": "Player",
                    "clubNameId": loggedIn.userId,
                }, {
                    sort: {
                        dateOfBirth: -1
                    },
                    limit: 10, // records to show per page
                    skip: skipCount
                });
            }

        } else if (loggedIn.role && (loggedIn.role == "Association") && 
            loggedIn.associationType == "State/Province/County" 
            && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {
            var toret = playerDBFind(loggedIn.interestedProjectName[0])
            if (toret) {
                Counts.publish(this, 'playersCountforacad', global[toret].find({
                "role": "Player",
                $or: [{
                    "associationId": loggedIn.userId
                }, {
                    "parentAssociationId": loggedIn.userId,
                }],
                /* $and:[
                       {"affiliationId":{$nin:[null,"","other"]}},
                       {"statusOfUser":"Active"}
                 ],*/
                }, {
                    sort: {
                        dateOfBirth: -1
                    }
                }), {
                    noReady: true
                });
                players = global[toret].find({
                    "role": "Player",
                    $or: [{
                        "associationId": loggedIn.userId
                    }, {
                        "parentAssociationId": loggedIn.userId,
                    }],
                    /*$and:[
                          {"affiliationId":{$nin:[null,"","other"]}},
                          {"statusOfUser":"Active"}
                    ]*/
                }, {
                    sort: {
                        dateOfBirth: -1
                    },
                    limit: 10, // records to show per page
                    skip: skipCount
                });
            }
            
        } else if (loggedIn.role && (loggedIn.role == "Association") && loggedIn.associationType == "District/City"
            && loggedIn.interestedProjectName && loggedIn.interestedProjectName.length != 0) {
            var toret = playerDBFind(loggedIn.interestedProjectName[0])
            if (toret) {
                Counts.publish(this, 'playersCountforacad', global[toret].find({
                "role": "Player",
                "associationId": loggedIn.userId,
                /*$and:[
                     {"affiliationId":{$nin:[null,"","other"]}},
                      {"statusOfUser":"Active"}
                ]*/
                }, {
                    sort: {
                        dateOfBirth: -1
                    }
                }), {
                    noReady: true
                });
                players = global[toret].find({
                    "role": "Player",
                    "associationId": loggedIn.userId,
                    /*$and:[
                          {"affiliationId":{$nin:[null,"","other"]}},
                          {"statusOfUser":"Active"}
                    ]*/
                }, {
                    sort: {
                        dateOfBirth: -1
                    },
                    limit: 10, // records to show per page
                    skip: skipCount
                });
            }
        }
    }

    return players
    }catch(e){
    }
});