customCollection = new Meteor.Collection('customCollection');

customCollectionSchema = new SimpleSchema ({
  "data":{
    type: String,
    label: "email",
    optional:true
  },
   "data2":{
    type: String,
    label: "email",
    optional:true
  },
  "data3":{
    type: String,
    label: "email",
    optional:true
  },
  "consumer_key":{
    type: String,
    label: "twitter consumer key",
    optional:true
  },
  "consumer_secret":{
    type: String,
    label: "twitter consumer secret",
    optional:true
  },
  "access_token_key":{
    type: String,
    label: "twitter consumer access token key",
    optional:true
  },
  "access_token_secret":{
    type: String,
    label: "twitter consumer access token secret",
    optional:true
  }
});

customCollection.attachSchema(customCollectionSchema);


authAddress = new Meteor.Collection('authAddress');

authAddressSchema = new SimpleSchema ({
  "data":{
    type: String,
    label: "email"
  },
});

authAddress.attachSchema(authAddressSchema);

barChartColor = new Meteor.Collection('barChartColor');
barChartColorSchema = new SimpleSchema({
  "key":{
    type:String,
    label:"key for chart type"
  },
  "player1FontColor":{
    type:String,
    label:"player1 font color"
  },
  "player2FontColor":{
    type:String,
    label:"player2 font color"
  },
  "player1Color":{
    type:String,
    label:"player1 winner color"
  },
  "player2Color":{
    type:String,
    label:"player2 winner color"
  }
});

barChartColor.attachSchema(barChartColorSchema);


schoolEventsToFind = new Meteor.Collection('schoolEventsToFind');

schoolEventsToFindSchema = new SimpleSchema ({
  "key":{
    type:String,
    label:"School"
  },
  "individualEventNAME":{
    type:[String],
    label:"array of event names"
  },
  "teamEventNAME":{
    type:[String],
    label:"array of team event names"
  },
  "dispNamesTeam":{
    type:[String],
    label:"display names for team"
  },
  "unwantedTeams":{
    type:[String],
    label:"unwanted team names if it is only individual"
  },
  sortOrder:{
    type:[String],
    label:"order of events to be fetched"
  },
  "tournamentTypes.$.name":{
    type:String,
    label:"name of tournament type"
  },
  "tournamentTypes.$.stateReq":{
    type:Boolean,
    label:"selection of state is required"
  },
  "tournamentTypes.$.displayName":{
    type:String,
    label:"name of tournament type"
  },
  "tournamentTypes.$.year":{
    type:String,
    label:"name of tournament type"
  },
  "tournamentTypes.$.type":{
    type:String,
    label:"name of tournament type"
  },
  "tournamentTypes.$.co":{
    type:String,
    label:"tournament type co"
  }
});

schoolEventsToFind.attachSchema(schoolEventsToFindSchema);

/*
{ "_id" : "BjvNR4yFho3PwT6tX", "key" : "School", "individualEventNAME" : [ "SJB", "SJG", "JB", "JG", "SB", "SG" ], "teamEventNAME" : [ "11Even Sub Junior Boy's Team", "11Even Sub Junior Girl's Team", "11Even Junior Boy's Team", "11Even Junior Girl's Team", "11Even Senior Boy's Team", "11Even Senior Girl's Team" ], "dispNamesTeam" : [ "Sub Junior Boy's Team", "Sub Junior Girl's Team", "Junior Boy's Team", "Junior Girl's Team", "Senior Boy's Team", "Senior Girl's Team" ], "unwantedTeam" : [ "11Even Senior Boy's Team", "11Even Senior Girl's Team" ], "sortOrder" : [ "SJB", "SJG", "JB", "JG", "SB", "SG", "11Even Sub Junior Boy's Team", "11Even Sub Junior Girl's Team", "11Even Junior Boy's Team", "11Even Junior Girl's Team" ], "tournamentTypes" : [ { "name" : "NITTC-National-2018", "stateReq" : false, "displayName" : "NITTC National 2018", "year" : "2018", "type" : "national" }, { "name" : "NITTC-State-2018", "stateReq" : false, "displayName" : "NITTC State 2018", "year" : "2018", "type" : "state" } ] }
*/