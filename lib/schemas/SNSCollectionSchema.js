SNSCollectionDB = new Meteor.Collection('SNSCollectionDB');

var SNSscoresSchema = new SimpleSchema ({
  "setScoresA": {
    type: [Number],
    label: "Set scores of Player-A"
  },
  "setScoresB": {
    type: [Number],
    label: "Set scores of Player-B"
  }/*,
  "applicableSports": {
    type: String,
    label: "Maybe, to check if this match record schema can be used for a given sport",
    allowedValues: ["Table Tennis", "Badminton", "Tennis", "Squash"]
  }*/
});
var playsWithSchema = new SimpleSchema({
  "playerId":{
    type:"String",
    label:"n-1 th player id",
    optional:true
  },
  "playerName":{
    type:String,
    label:"n-1 th player name",
    optional:true
  },
  "scores": {
    type: SNSscoresSchema,
    label: "Scores of the match",
    optional: true
  },
  "matchStatus":{
    type: String,
    allowedValues: ['yetToPlay', 'completed', 'bye', 'walkover', 'cancel','completedWalk'],
    label: "Status of the match",
    optional: true
  },
  "approvalStatus":{
    type: String,
    allowedValues: ['waiting','approved',"disapproved"],
    label: "agree or disagree",
    optional: true
  },
  "points":{
    type:String,
    label:"poins of main player",
    optional: true
  },
  "color":{
    type:String,
    label:"color of player n-1th",
    optional: true
  },
  "winnerName":{
    type:String,
    label:"name of winner",
    optional: true
  }
});

var SNSRecordsSchema = new SimpleSchema ({
 "mainPlayerID":{
  type:"String",
  label:"nth player id",
  optional:true
 },
 "mainPlayerName":{
  type:String,
  label:"nth player name",
  optional:true
 },
 "totalPoints":{
  type:Number,
  label:"total points of player A",
  optional:true
 },
 "playsWith":{
  type:[playsWithSchema],
  optional:true
 }
});

var SNSCollectionSchema = new SimpleSchema ({
  "tournamentId" : {
    type: String,
    label: "The Doc Id of the tournament",
    denyUpdate: true
  },
  "eventId":{
    type: String,
    label: "The id of the event",
    denyUpdate: true
  },
  "eventName" : {
    type: String,
    label: "The name of the event",
    denyUpdate: true
  },
  "eventParticipants":{
    type:[String],
    label:"Event Participants",
    optional:true
  },
  "snsRecords" : {
    type: [SNSRecordsSchema],
    label: "Record of all the matches in that Tournament/Event",
    optional:true
  }
});

SNSCollectionDB.attachSchema(SNSCollectionSchema);