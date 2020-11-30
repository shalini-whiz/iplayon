/**
 * Meteor Method to delete subscriber from an event
 * @collectionName : events
 * @passedByValues : userId and subscribedEventID
 * @dataType : Object
 * @dbQuery : update
 * @methodDescription : for given subscribedEventID pull the userId
 *                     from eventParticipatants for events collections
 */
Meteor.methods({
    'deleteTeamSubscriberFromEvent': function(xData) {
        try {

            check(xData, Object);
            var eventTeamParticipants = []
            eventTeamParticipants.push({
                "teamParticipants": [],
                "teamId": xData.teamId
            });
            var s = events.update({
                "_id": xData.subscribedEventID
            }, {
                $pull: {
                    "eventTeamParticipants": {
                        "teamParticipants": [],
                        "teamId": xData.teamId
                    }
                }
            });
            if (s) {
                return true;
            } else
                return this.ready();
        } catch (e) {}
    }
});

/**
 * Meteor Method to delete subscriber from an event and blacklist the user
 * @collectionName : events, users
 * @passedByValues : userId, currentUserId and subscribedEventID
 * @dataType : Object
 * @dbQuery : update
 * @methodDescription : for given subscribedEventID pull the userId
 *                     from eventParticipatants of events collection,
 *                     for currentUserId push the userId to blackListedUsers
 *                     for users collection
 */
Meteor.methods({
    'deleteTeamSubscriberAndBlackFromEvent': function(xData) {
        try {

            check(xData, Object);
            var eventTeamParticipants = []
            eventTeamParticipants.push({
                "teamParticipants": [],
                "teamId": xData.teamId
            });
            var s = events.update({
                "_id": xData.subscribedEventID
            }, {
                $pull: {
                    "eventTeamParticipants": {
                        "teamParticipants": [],
                        "teamId": xData.teamId
                    }
                }
            });
            if (s) {
                var u = Meteor.users.update({
                    "userId": xData.currentUserId
                }, {
                    $push: {
                        "blackListedUsers": xData.teamId + ""
                    }
                });
                return true;
            }
        } catch (e) {}
    }
});

/**
 * Meteor Method to white list the blacklisted the user
 * @collectionName : users
 * @passedByValues : userId, currentUserId
 * @dataType : Object
 * @dbQuery : update
 * @methodDescription : for currentUserId pull the userId from blackListedUsers
 *                     for users collection
 */
Meteor.methods({
    'whiteListTeam': function(xData) {
        try {

            check(xData, Object);
            var s = Meteor.users.update({
                "_id": xData.currentUserId
            }, {
                $pull: {
                    "blackListedUsers": xData.userId + ""
                }
            });
        } catch (e) {}
    }
})