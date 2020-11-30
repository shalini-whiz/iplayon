teamsFormat = new Meteor.Collection('teamsFormat');

playerFormatSchema = new SimpleSchema ({
  "playerNo" : {
    type: String,
    label: "Player No"
  },
  "mandatory": {
    type: String,
    label: "Player mandatory or not"
  },
  "dateType" : {
    type: String,
    allowedValues: ['before', 'onBefore', 'after', 'onAfter', 'any'],
    label: "Player date criteria"
  },
  "dateValue":{
    type:Date,
    label:"Player Date",
    optional:true
  },
  "gender":{
    type:String,
    label:"player gender criteria"
  },
  "locationType":{
    type:String,
    label:"player location criteria"
  },
  "minClass":{
    type:String,
    label:"student/player min class",
    optional:true
  },
  "maxClass":{
    type:String,
    label:"student/player max class",
    optional:true
  }
})

teamsFormatSchema = new SimpleSchema ({
  "teamFormatName" : {
    type: String,
    label: "team format name",
  },
  "selectedProjectId" : {
    type: String,
    label: "team sport",
  },
  "minPlayers" : {
    type: String,
    label: "min team players",
  },
  "maxPlayers" : {
    type: String,
    label: "max team players",
  },
  "rankedOrNot":{
    type:String,
    label:"team ranking"
  },
  "formatType":{
    type:String,
    label:"team format type",
    optional:true
  },
  "mandatoryPlayersArray":{
    type:[String],
    label: "mandatory players",
  },
  "playerFormatArray.$" : {
    type: playerFormatSchema,
    label: "list of players in team format"
  }
});



teamsFormat.attachSchema(teamsFormatSchema);

