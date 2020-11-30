schoolTeams = new Meteor.Collection('schoolTeams');

schoolTeamsSchema = new SimpleSchema({
        teamName:{
            type:String,
            label:"Team Name"
        },
        teamFormatId:{
            type:String,
            label:"Project Name"
        },
        teamManager:{
            type:String,
            label:"Team Owner",
        },
        "teamMembers.$.playerNumber":{
            type:String,
            label:"Event Id",
            optional:true
        },   
        "teamMembers.$.playerId":{
            type:String,
            label:"on or before",
            optional:true
        },
        "teamMembers.$.onlyIndividual":{
            type:true,
            label:"true or false",
            optional:true
        },
        "teamMembers.$.individualEvent":{
            type:true,
            label:"true or false",
            optional:true
        },
        "teamMembers.$.teamEvent":{
            type:true,
            label:"true or false",
            optional:true
        },
        "teamAffiliationId":{
            type:String,
            optional:true
        },
        "source":{
            type:String,
            optional:true
        },
        "schoolId":{
            type:String,
            optional:true
        },
        "subscriptionForSchool":{
            type:Boolean,
            optional:true
        },
        "schoolName":{
            type:String,
            optional:true
        },
        "tournamentId":{
            type:String,
            optional:true
        }
});
schoolTeams.attachSchema(schoolTeamsSchema);

schoolPlayerEntries = new Meteor.Collection('schoolPlayerEntries');
var schoolPlayerEntriesSchema = new SimpleSchema({

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
schoolPlayerEntries.attachSchema(schoolPlayerEntriesSchema);

schoolPlayerTeamEntries = new Meteor.Collection('schoolPlayerTeamEntries');
var schoolPlayerTeamEntriesSchema = new SimpleSchema({

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
schoolPlayerTeamEntries.attachSchema(schoolPlayerTeamEntriesSchema);
