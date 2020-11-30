eventSchedule = new Meteor.Collection('eventSchedule');

var eventScheduleSchema = new SimpleSchema({
    "tournamentId": {
        type: "String",
        label: "tournamentId",
    },
    "eventName":{
        type: "String",
        label: "eventName",  
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
    "roundNo": {
        type: String,
        label: "roundNo",
    },
});

eventSchedule.attachSchema(eventScheduleSchema);
