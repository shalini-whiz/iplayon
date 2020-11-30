import {
    playerDBFind
}
from '../../methods/dbRequiredRole.js'

//userDetailsTTUsed

Meteor.publish('usersForAnalyticsPlayers', function(searchValue, searchCriteria) {
    try {
        if (searchValue != null && searchValue != undefined) {

            var reObj = new RegExp("^"+searchValue.trim(), 'i');
            if (this.userId != undefined) {
                var toret = "userDetailsTT"

                var userID = this.userId;
                if (userID) {
                    var userDEt = Meteor.users.findOne({
                        "_id": userID
                    });
                    if (userDEt && userDEt.interestedProjectName && userDEt.interestedProjectName.length) {
                        toret = playerDBFind(userDEt.interestedProjectName[0])
                    }

                }

                var lData = global[toret].find({
                    userName: {
                        $regex: reObj
                    }
                }, {
                    sort: {
                        userName: 1
                    },
                    fields: {
                        userName: 1,
                        userId: 1
                    },
                    limit: 15
                });
                return lData
            }
        }
    } catch (e) {}
});

Meteor.publish('selectedEventPastEvents', function(eventName,selectedPlayer1,selectedPalyer2,skipCount) {
    try{

        if(eventName&&selectedPlayer1&&selectedPalyer2){
            Counts.publish(this, 'pastEventsPlayerAnalytics', pastEvents.find({
                   eventName:eventName,
                   $or:[
                    {eventParticipants:selectedPlayer1},
                    {eventParticipants:selectedPalyer2}
                   ]
                }), { 
                    noReady: true
                });

            var lData = pastEvents.find({
                eventName:eventName,
                $or:[
                {eventParticipants:selectedPlayer1},
                {eventParticipants:selectedPalyer2}
                ]
            },{ 
                fields:{
                    eventName:1,
                    tournamentId:1,
                    eventParticipants:1
                },
                sort:{
                    eventStartDate1:-1
                },
                limit: 10,
                skip: skipCount
            });
            if(lData)
                return lData
            return this.ready()
        }

    }catch(e){
    }
});

Meteor.publish('usersForSequenceAnalyticsPlayers', function(searchValue, searchCriteria) {
    try {
        if (searchValue != null && searchValue != undefined) {

            var toret = "userDetailsTT"
            var userID = this.userId;
            
            if (userID) {
                var userDEt = Meteor.users.findOne({
                    "_id": userID
                });
                if (userDEt && userDEt.interestedProjectName && userDEt.interestedProjectName.length) {
                    toret = playerDBFind(userDEt.interestedProjectName[0])
                }

            }

            var reObj = new RegExp(searchValue.trim(), 'i');
            if (this.userId != undefined) {
                var lData = global[toret].find({
                    userName: {
                        $regex: reObj
                    }
                }, {
                    sort: {
                        userName: 1
                    },
                    fields: {
                        userName: 1,
                        userId: 1
                    },
                    limit: 5
                });
                return lData
            }
        }
    } catch (e) {}
});


Meteor.publish('newusersForSequenceAnalyticsPlayers', function(searchValue, searchCriteria) {
    try {
        if (searchValue != null && searchValue != undefined) {
            var reObj = new RegExp(searchValue.trim(), 'i');
            if (this.userId != undefined) {
                var lData = playerDetailsRecord.find({
                    playerName: {
                        $regex: reObj
                    },
                    userId:null
                }, {
                    sort: {
                        playerName: 1
                    },
                    fields: {
                        playerName: 1,                        
                    },
                    limit: 5
                });
                return lData
            }
        }
    } catch (e) {}
});


Meteor.methods({
    'serviceStrokesSearchPublication' : function(searchValue,searchType) {
        try {
        if (searchValue != null && searchValue != undefined) {
            var reObj = new RegExp(searchValue.trim(), 'i');
            if (Meteor.userId() != undefined) {
                if(searchType==1){
                    var lData = serviceStrokes.find({
                        serviceName: {
                            $regex: reObj
                        },
                    }, {
                        sort: {
                            serviceName: 1
                        },
                        limit: 5
                    }).fetch();
                    if(lData.length)
                    return lData
                }
                else{
                    var lData = strokes.find({
                        strokeName: {
                            $regex: reObj
                        },
                    }, {
                        sort: {
                            strokeName: 1
                        },
                        limit: 5
                    }).fetch();
                    if(lData.length)
                    return lData
                }
            }
        }
        } catch (e) {}
    }
});

Meteor.methods({
    'destinationStrokesSearchPublication' : function(searchValue,searchType) {
        try {
        if (searchValue != null && searchValue != undefined) {
            var reObj = new RegExp(searchValue.trim(), 'i');
            if (Meteor.userId() != undefined) {
                if(searchType==undefined){
                    var lData = p6DestinationPoints.find({
                        destinationName: {
                            $regex: reObj
                        },
                    }, {
                        sort: {
                            destinationName: 1
                        },
                        limit: 5
                    }).fetch();
                    if(lData.length)
                    return lData
                }
                else if(searchType=="p6DestinationPoints"){
                    var lData = p6DestinationPoints.find({
                        destinationName: {
                            $regex: reObj
                        },
                    }, {
                        sort: {
                            destinationName: 1
                        },
                        limit: 5
                    }).fetch();
                    if(lData.length)
                    return lData
                }
            }
        }
        } catch (e) {}
    }
});