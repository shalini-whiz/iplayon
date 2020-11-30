  Template.subscriptionPayment.onRendered(function(){

  })

  Template.subscriptionPayment.onRendered(function() {
    $('.scrollableLisst').slimScroll({
        height: '10.4em',
        color: 'black',
        size: '3px',
        width: '100%'
    });
})
  Template.subscriptionPayment.helpers({
    lEvent: function() {
        var lEvents = events.find({
            "_id": Router.current().params._PostId
        }).fetch();
        if (lEvents) {
            return lEvents;
        }
    },
    "eventsDetails": function() {
        var details = [];
        var key;
        try {
            var data = {};
            var lEvents = events.findOne({
                "_id": Router.current().params._PostId
            });
            if (lEvents && lEvents.eventsUnderTournament) {

                for (var j = 0; j < lEvents.eventsUnderTournament.length; j++) {
                    var eventDetails = events.findOne({
                        "_id": lEvents.eventsUnderTournament[j],
                        "eventParticipants":{$in:[Meteor.userId()]}
                    });
                    if (eventDetails)
                        data[eventDetails.abbName] = eventDetails._id;

                }
                var eventFeeSettingsFind = eventFeeSettings.findOne({
                    "tournamentId": Router.current().params._PostId
                })
                if (eventFeeSettingsFind) {
                    var eventsNAMES = eventFeeSettingsFind.events;
                    key = eventsNAMES;
                    key.push("fees")
                } else
                    key = ["MCB", "MCG", "CB", "CG", "SJB", "SJG", "JB", "JG", "YB", "YG", "M", "W", "NMS", "NMD", "OS", "OD", "O", "fees"]

                var k = JSON.parse(JSON.stringify(data, key, 18));
                data["eventIds"] = _.values(k);
                data["eventAbbNames"] = _.keys(k);
                details.push(data);
            }
            return details
        } catch (e) {}
    },
});