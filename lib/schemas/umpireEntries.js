umpireEntries = new Meteor.Collection('umpireEntries');
var umpireEntriesSchema = new SimpleSchema({

    umpireId: {
        type: String,
        label: "umpire Id",
    },    
    tournamentId: {
        type: String,
        label: "tournament Id",
    },  
    subscribedDates: {
        type: [Date],
        label: "subscribed umpire list",
        optional: true
    },  
});
umpireEntries.attachSchema(umpireEntriesSchema);