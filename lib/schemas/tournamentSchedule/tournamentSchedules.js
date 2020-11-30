tournamentSchedule = new Meteor.Collection('tournamentSchedule');

var scheduleSchema = new SimpleSchema({
    "round": {
        type: "String",
        label: "round",
        optional: true
    },
    "match": {
        type: String,
        label: "match",
        optional: true
    },
    "matchInt": {
        type: Number,
        label: "matchInt",
    },
    "time": {
        type: String,
        label: "time starts at",
        optional: true
    },
    "endTime": {
        type: String,
        label: "endTime",
        optional: true
    },
    "timeISO": {
        type: Date,
        label: "time starts at ISO",
        optional: true
    },
    "endTimeISO": {
        type: Date,
        label: "endTime ISO",
        optional: true
    },
    "dateOfEvent": {
        type: String,
        label: "dateOfEvent",
        optional: true
    },
    "dateOfEventMoment": {
        type: Date,
        label: "dateOfEvent",
        optional: true
    },
    "table": {
        type: String,
        label: "table number",
        optional: true
    },
    "order": {
        type: Number,
        label: "table number",
        optional: true
    },
    "starttimesession": {
        type: String
    },
    endtimesession: {
        type: String
    },
    "starttimesessionISO": {
        type: Date,
        label: "time starts at ISO",
        optional: true
    },
    "endtimesessionISO": {
        type: Date,
        label: "endTime ISO",
        optional: true
    },
    selectedDate: {
        type: String,
        label: "selectedDate",
        optional: true
    },
});

var durationSchema = new SimpleSchema({
    "Finals": {
        type: "Finals",
        label: "round",
        optional: true
    },
    "SF": {
        type: String,
        label: "SF",
        optional: true
    },
    "QF": {
        type: String,
        label: "QF",
        optional: true
    },
    "PQF": {
        type: String,
        label: "PQF",
        optional: true
    },
    "R32": {
        type: String,
        label: "R32",
        optional: true
    },
    "R64": {
        type: String,
        label: "R64",
        optional: true
    },
    "R128": {
        type: String,
        label: "R128",
        optional: true
    },
    "R256": {
        type: String,
        label: "R256",
        optional: true
    },
    "R512": {
        type: String,
        label: "R512",
        optional: true
    },
    selectedDate: {
        type: String,
        label: "selectedDate",
        optional: true
    },
    //2-no
    selectedDateMoment: {
        type: Date,
        label: "selectedDateMoment",
        optional: true
    },
});

var tournamentScheduleSchema = new SimpleSchema({
    //1
    tournamentId: {
        type: String,
        label: "tournamentId",
        optional: true
    },
    //1-no
    selectedDate: {
        type: String,
        label: "selectedDate",
        optional: true
    },
    //2-no
    selectedDateMoment: {
        type: Date,
        label: "selectedDateMoment",
        optional: true
    },
    //2
    "scheduledData.$.eventName": {
        type: String,
        label: "eventName",
        optional: true
    },
    //new-2
    "scheduledData.$.abbName": {
        type: String,
        label: "abbName",
        optional: true
    },
    //3
    "scheduledData.$.round": {
        type: String,
        label: "round",
        optional: true
    },
    //4
    "scheduledData.$.everound": {
        type: String,
        label: "eventName and round",
        optional: true
    },
    //5
    "scheduledData.$.matchNumbers": {
        type: [String],
        label: "matchNumbers",
        optional: true
    },
    //6
    "scheduledData.$.matchNumbersasString": {
        type: String,
        label: "matchNumbers",
        optional: true
    },
    "scheduledData.$.assignedMatchNum": {
        type: [String],
        label: "assignedMatchNum",
        optional: true
    },
    //7
    "scheduledData.$.unAssignedMatchNum": {
        type: [String],
        label: "unAssignedMatchNum",
        optional: true
    },

    //8
    "scheduledData.$.order": {
        type: Number,
        label: "order",
        optional: true
    },

    //9
    "scheduledData.$.eventId": {
        type: String,
        optional: true
    },
    //10
    "scheduledData.$.tournamentId": {
        type: String,
        optional: true
    },
    //11
    "scheduledData.$.projectType": {
        type: Number,
        optional: true
    },

    //12
    "scheduledData.$.duration": {
        type: String,
        label: "duration",
        optional: true
    },
    //13
    "scheduledData.$.starttimesession": {
        type: String,
        optional: true
    },
    //15
    "scheduledData.$.endtimesession": {
        type: String,
        optional: true
    },

    "scheduledData.$.starttimesessionISO": {
        type: Date,
        label: "time starts at ISO",
        optional: true
    },
    "scheduledData.$.endtimesessionISO": {
        type: Date,
        label: "endTime ISO",
        optional: true
    },
    //16
    "scheduledData.$.noOfTables": {
        type: [String],
        label: "noOfTables",
        optional: true
    },

    //no
    "scheduledData.$.sessionNumber": {
        type: String,
        label: "sessionNumber",
        optional: true
    },
    "scheduledData.$.noOfTablessession": {
        type: String,
        label: "noOfTablessession",
        optional: true
    },

    //no
    "scheduledData.$.lastNonZeroMatch": {
        type: String,
        label: "lastNonZeroMatch",
        optional: true
    },

    //===17
    "scheduledData.$.schedule": {
        type: [scheduleSchema],
        label: "schedule",
        optional: true
    },
});
tournamentSchedule.attachSchema(tournamentScheduleSchema);



tournamentScheduleTableNos = new Meteor.Collection('tournamentScheduleTableNos');

var tournamentScheduleTableNosSchema = new SimpleSchema({
    selectedDate: {
        type: String,
        label: "selectedDate",
        optional: true
    },
    //2-no
    selectedDateMoment: {
        type: Date,
        label: "selectedDateMoment",
        optional: true
    },
    sessionNumber: {
        type: Number,
        label: "sessionNumber",
        optional: true
    },
    tournamentId: {
        type: String,
        label: "tournamentId",
        optional: true
    },
    eventName: {
        type: String,
        label: "eventName",
    },
    starttimesession: {
        type: String,
        optional: true
    },
    endtimesession: {
        type: String,
        optional: true
    },
    "starttimesessionISO": {
        type: Date,
        label: "time starts at ISO",
        optional: true
    },
    "endtimesessionISO": {
        type: Date,
        label: "endTime ISO",
        optional: true
    },
    noOfTables: {
        type: [String],
        label: "noOfTables",
        optional: true
    },
    roundsSelected: {
        type: [String],
        label: "roundsSelected",
    },
    duration: {
        type: String,
        label: "duration"
    }
});
tournamentScheduleTableNos.attachSchema(tournamentScheduleTableNosSchema);