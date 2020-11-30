tourTeamSchedule = new Meteor.Collection('tourTeamSchedule');

var tourTeamScheduleSchema = new SimpleSchema({
    "tournamentId": {
        type: "String",
        label: "tournamentId",
    },
    "scheduleDate": {
        type: Date,
        label: "match",
    },
    "startTime": {
        type: String,
        label: "startTime",
    },
    "endTime": {
        type: String,
        label: "endTime",
    },
    "teamAId":{
        type: String,
        label: "teamAId",
    },
    "teamBId":{
        type: String,
        label: "teamBId",
    },
    "tableNo": {
        type: String,
        label: "table number",
    },
   
});

tourTeamSchedule.attachSchema(tourTeamScheduleSchema);
