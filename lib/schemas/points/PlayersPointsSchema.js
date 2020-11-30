PlayerPoints = new Meteor.Collection('PlayerPoints');

var PlayerTournPoints = new SimpleSchema ({
  "tournamentId":{
    type:String,
    label:"tournament Id",
    optional:true
  },
  "tournamentName":{
    type:String,
    label:"tournament Name",
    optional:true
  },
  "tournamentPoints":{
    type:Number,
    label:"tournament points",
    optional:true
  }
});

PlayerPointsSchema = new SimpleSchema({
  "playerId":{
    type:String,
    label:"id",
  },
  "afId":{
    type:String,
    label:"a id",
  },
  "associationId":{
    type:String,
    label:"AssociationId of user in player points",
    optional:true,

  },
  "parentAssociationId":{
    type:String,
    optional:true,
    label:"dist.AssociationId of user in player points",
  },
  "playerName":{
    type:String,
    label:"Player name"
  },
  "sportId":{
    type:String,
    label:"sportId"
  },
  "organizerId":{
    type:String,
    label:"organizer Id"
  },
  "eventName":{
    type:String,
    label:"event name"
  },
  "eventPoints.$":{
    type:PlayerTournPoints,
    label:"points"
  },
  "totalPoints":{
    type:Number,
    label:"total points"
  },
  "extTournament":{
    type:[String],
    label:"external tournament array",
    optional:true
  },
  "extTournamentCount":{
    type:Number,
    label:"External Tournament Count",
    optional:true
  }
})

PlayerPoints.attachSchema(PlayerPointsSchema);