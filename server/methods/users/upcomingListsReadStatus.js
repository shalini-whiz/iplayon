/**
 * Meteor Method to update upcomingListsReadStatus
 * @collectionName : upcomingListsReadStatus
 * @dbQuery : update
 * @dataType : String
 * @passedByValues : eventId
 * @methodDescription : create an array called eventReadStatus,
 *                      push the given eventId as eventId and
 *                      readStatus as false, and update the field
 *                      eventIdReadStatus as eventReadStatus array
 *                      for the given userId for upcomingListsReadStatus collection
 */
Meteor.methods({
    'upcomingListsAndStatus': function(xData) {
        try {
            check(xData, String);
            var eventReadStatus = [];
            eventReadStatus.push({
                "eventId": xData,
                "readStatus": false
            });
            var userId = Meteor.users.findOne({
                "_id": Meteor.userId()
            });
            var j = upcomingListsReadStatus.findOne({
                "userId": userId.userId
            });
            if (j == undefined)
                upcomingListsReadStatus.insert({
                    "userId": userId.userId
                })
            var k = upcomingListsReadStatus.find({
                "userId": userId.userId,
                "eventIdReadStatus": {
                    $elemMatch: {
                        "eventId": xData,
                        "readStatus": true
                    }
                }
            }).fetch()
            if (k.length == 0) {
                var s = upcomingListsReadStatus.update({
                    "userId": userId.userId
                }, {
                    $addToSet: {
                        eventIdReadStatus: {
                            $each: eventReadStatus
                        }
                    }
                });
            } else {
                var j = upcomingListsReadStatus.update({
                    "eventIdReadStatus.eventId": xData,
                    "eventIdReadStatus.readStatus": true
                }, {
                    $pull: {
                        "eventIdReadStatus": {
                            "eventId": xData,
                            "readStatus": true
                        }
                    }
                }, {
                    "multi": true
                });
                upcomingListsReadStatus.update({
                    "userId": userId.userId
                }, {
                    $addToSet: {
                        eventIdReadStatus: {
                            $each: eventReadStatus
                        }
                    }
                });;
            }
            return true;
        
    } catch (e) {}}
});


Meteor.methods({
    'changeUpcomingListsAndStatus': function(xData) {
        try {
            check(xData, String);
            var eventReadStatus = [];
            eventReadStatus.push({
                "eventId": xData,
                "readStatus": true
            });
            var userId = Meteor.users.findOne({
                "_id": Meteor.userId()
            });
            var s = upcomingListsReadStatus.find({
                "eventIdReadStatus": {
                    $elemMatch: {
                        "eventId": xData,
                        "readStatus": false
                    }
                }
            }).fetch();
            var j = upcomingListsReadStatus.update({
                "eventIdReadStatus.eventId": xData,
                "eventIdReadStatus.readStatus": false
            }, {
                $pull: {
                    "eventIdReadStatus": {
                        "eventId": xData,
                        "readStatus": false
                    }
                }
            }, {
                "multi": true
            });
            for (var i = 0; i < s.length; i++) {
                upcomingListsReadStatus.update({
                    "_id": s[i]._id
                }, {
                    $addToSet: {
                        eventIdReadStatus: {
                            $each: eventReadStatus
                        }
                    }
                });
            }
            return true;
        }
     catch (e) {}}
});

Meteor.methods({
    'changeAfterDeleteUpcomingListsAndStatus': function(xData) {
        try {
            check(xData, String);
            var eventReadStatus = [];
            eventReadStatus.push({
                "eventId": xData,
                "readStatus": true
            });
            var userId = Meteor.users.findOne({
                "_id": Meteor.userId()
            });
            //var s = upcomingListsReadStatus.find({ "eventIdReadStatus": { $elemMatch: { "eventId": xData,"readStatus":false } }}).fetch();
            var j = upcomingListsReadStatus.update({
                "eventIdReadStatus.eventId": xData,
                "eventIdReadStatus.readStatus": false
            }, {
                $pull: {
                    "eventIdReadStatus": {
                        "eventId": xData,
                        "readStatus": false
                    }
                }
            }, {
                "multi": true
            });

            return true;
        }
     catch (e) {}}
});