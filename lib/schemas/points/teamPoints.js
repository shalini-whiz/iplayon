teamPoints = new Meteor.Collection('teamPoints');
teamPointsSchema = new SimpleSchema({
  "tournamentId":{
    type:String,
    label:"tournamentId"
  },
  "teamId":{
    type:String,
    label:"id",
  },
  "played":{
  	type:Number,
    label:"match played"
  },
   "won":{
  	type:Number,
    label:"match won"
  },
   "loss":{
  	type:Number,
    label:"match loss"
  },
  "points":{
    type:Number,
    label:"points"
  },
  "year":{
  	type:Number,
    label:"year",
  }
})

teamPoints.attachSchema(teamPointsSchema);
