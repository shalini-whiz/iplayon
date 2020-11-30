MatchCollectionConfig = new Meteor.Collection('MatchCollectionConfig');

MatchCollectionConfigSchema = new SimpleSchema ({
  "projectId":{
    type: String,
    label: "Id of project",
    optional:true
  },
  "projectMainName":{
    type: String,
    label: "Name of project",
    optional:true
  },
  "tournamentId":{
    type: String,
    label: "Id of tournament",
    optional:true
  },
  "eventName":{
    type: String,
    label: "Event Name",
    optional:true
  },
  "roundValues.$.roundNumber":{
    type:String,
    label: "Round Number",
    optional:true
  },
  "roundValues.$.roundName":{
    type:String,
    label: "Round Name",
    optional:true
  },
  "roundValues.$.noofSets":{
    type:String,
    label: "Number of sets",
    optional:true
  },  
  "roundValues.$.minScores":{
    type:String,
    label: "minimum score",
    optional:true
  },  
  "roundValues.$.minDifference":{
    type:String,
    label: "minimum difference",
    optional:true
  }, 
  "roundValues.$.points":{
    type:String,
    label: "minimum difference",
    optional:true
  }, 
  });

MatchCollectionConfig.attachSchema(MatchCollectionConfigSchema);


MatchTeamCollectionConfig = new Meteor.Collection('MatchTeamCollectionConfig');

MatchTeamCollectionConfigSchema = new SimpleSchema ({
  "teamFormatId":{
    type:String,
    label:"Id of the match team format selected for teams format"
  },
  "projectId":{
    type: String,
    label: "Id of project",
    optional:true
  },
  "projectMainName":{
    type: String,
    label: "Name of project",
    optional:true
  },
  "tournamentId":{
    type: String,
    label: "Id of tournament",
    optional:true
  },
  "eventName":{
    type: String,
    label: "Event Name",
    optional:true
  },
  "roundValues.$.roundNumber":{
    type:String,
    label: "Round Number",
    optional:true
  },
  "roundValues.$.roundName":{
    type:String,
    label: "Round Name",
    optional:true
  },
  "roundValues.$.noofMatches":{
    type:String,
    label: "no of matches",
    optional:true
  }, 
  "roundValues.$.noofSets":{
    type:String,
    label: "Number of sets",
    optional:true
  },  
 
  });

MatchTeamCollectionConfig.attachSchema(MatchTeamCollectionConfigSchema);


MatchTeamBMCollectionConfig = new Meteor.Collection('MatchTeamBMCollectionConfig');

MatchTeamBMCollectionConfigSchema = new SimpleSchema ({
  "teamFormatId":{
    type:String,
    label:"Id of the match team format selected for teams format"
  },
  "projectId":{
    type: String,
    label: "Id of project",
    optional:true
  },
  "projectMainName":{
    type: String,
    label: "Name of project",
    optional:true
  },
  "tournamentId":{
    type: String,
    label: "Id of tournament",
    optional:true
  },
  "eventName":{
    type: String,
    label: "Event Name",
    optional:true
  },
  "roundValues.$.roundNumber":{
    type:String,
    label: "Round Number",
    optional:true
  },
  "roundValues.$.roundName":{
    type:String,
    label: "Round Name",
    optional:true
  },
  "roundValues.$.noofMatches":{
    type:String,
    label: "no of matches",
    optional:true
  }, 
  "roundValues.$.noofSets":{
    type:String,
    label: "Number of sets",
    optional:true
  },  
 
  });

MatchTeamBMCollectionConfig.attachSchema(MatchTeamCollectionConfigSchema);