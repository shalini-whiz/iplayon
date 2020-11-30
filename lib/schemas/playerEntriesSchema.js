eventFeeSettings = new Meteor.Collection('eventFeeSettings');

var eventFeeSettingsSchema = new SimpleSchema({
    tournamentId: {
        type: String,
        label: "tournament Id",
        optional: true
    },
    events: {
        type: [String],
        label: "ordered event list",
        optional: true
    },

    eventFees: {
        type: [String],
        label: "ordered event fees",
        optional: true
    },
    singleEvents: {
        type: [String],
        label: "ordered single events",
        optional: true
    },
    singleEventFees: {
        type: [String],
        label: "ordered single event fees",
        optional: true
    },
    teamEvents: {
        type: [String],
        label: "ordered team events",
        optional: true
    },
    teamEventFees: {
        type: [String],
        label: "ordered team event fees",
        optional: true
    },

});
eventFeeSettings.attachSchema(eventFeeSettingsSchema);


playerEntries = new Meteor.Collection('playerEntries');
var playerEntriesSchema = new SimpleSchema({

    playerId: {
        type: String,
        label: "player Id",
    },
    academyId: {
        type: String,
        label: "academy Id",
    },
    associationId: {
        type: String,
        label: "association Id",
        optional: true
    },
    parentAssociationId: {
        type: String,
        label: "parent association Id",
        optional: true
    },
    tournamentId: {
        type: String,
        label: "tournament Id",
        optional: true
    },
    subscribedEvents: {
        type: [String],
        label: "subscribed event list",
        optional: true
    },

    totalFee: {
        type: String,
        label: "totalfee",
        optional: true
    },
    paidOrNot: {
        type: Boolean,
        label: "payment status",
        optional: true
    },
    schoolId: {
        type: String,
        label: "school Id",
        optional: true
    },

});
playerEntries.attachSchema(playerEntriesSchema);


academyEntries = new Meteor.Collection('academyEntries');
var academyEntriesSchema = new SimpleSchema({
    associationId: {
        type: String,
        label: "association Id",
        optional: true

    },
    parentAssociationId: {
        type: String,
        label: "parent association Id",
        optional: true

    },
    academyId: {
        type: String,
        label: "academy Id",
    },
    tournamentId: {
        type: String,
        label: "tournament Id",
        optional: true
    },
    subscribedEvents: {
        type: [String],
        label: "subscribed event list",
        optional: true
    },

    totalFee: {
        type: String,
        label: "totalfee",
        optional: true
    },
    paidOrNot: {
        type: Boolean,
        label: "payment status",
        optional: true
    }

});
academyEntries.attachSchema(academyEntriesSchema);

districtAssociationEntries = new Meteor.Collection('districtAssociationEntries');
var districtAssociationEntriesSchema = new SimpleSchema({
    associationId: {
        type: String,
        label: "association Id",
        optional: true

    },
    parentAssociationId: {
        type: String,
        label: "parent association Id",
        optional: true

    },
    tournamentId: {
        type: String,
        label: "tournament Id",
        optional: true
    },
    subscribedEvents: {
        type: [String],
        label: "subscribed event list",
        optional: true
    },
    totalFee: {
        type: String,
        label: "totalfee",
        optional: true
    },
    paidOrNot: {
        type: Boolean,
        label: "payment status",
        optional: true
    }

});

districtAssociationEntries.attachSchema(districtAssociationEntriesSchema);



playerEntriesComputeTotal = new Meteor.Collection('playerEntriesComputeTotal');
var playerEntriesComputeTotalSchema = new SimpleSchema({
    playerId: {
        type: String,
        label: "player Id",
    },
    tournamentId: {
        type: String,
        label: "tournament Id",
        optional: true
    },
    subscribedEvents: {
        type: [String],
        label: "subscribed event list",
        optional: true
    },
    totalFee: {
        type: String,
        label: "totalfee",
        optional: true
    },
    loggedinID: {
        type: String,
        label: "loggedinID",
    }
});
playerEntriesComputeTotal.attachSchema(playerEntriesComputeTotalSchema);


playerTeamEntries = new Meteor.Collection('playerTeamEntries');
var playerTeamEntriesSchema = new SimpleSchema({

    playerId: {
        type: String,
        label: "player Id",
    },
    academyId: {
        type: String,
        label: "academy Id",
    },
    associationId: {
        type: String,
        label: "association Id",
        optional: true
    },
    parentAssociationId: {
        type: String,
        label: "parent association Id",
        optional: true
    },
    tournamentId: {
        type: String,
        label: "tournament Id",
        optional: true
    },
    subscribedEvents: {
        type: [String],
        label: "subscribed event list",
        optional: true
    },
    subscribedTeamID: {
        type: [String],
        label: "subscribed team id list",
        optional: true
    },
    totalFee: {
        type: String,
        label: "totalfee",
        optional: true
    },
    paidOrNot: {
        type: Boolean,
        label: "payment status",
        optional: true
    },
    "subscribedTeamsArray.$.eventName":{
        type:String,
        label:"Event Name",
        optional:true
    },  
    "subscribedTeamsArray.$.teamId": {
        type: String,
        label: "teamId",
        optional: true
    },
    schoolId: {
        type: String,
        label: "school Id",
        optional: true
    },
});
playerTeamEntries.attachSchema(playerTeamEntriesSchema);
