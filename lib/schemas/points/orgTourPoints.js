
orgTourPoints = new Meteor.Collection('orgTourPoints');

orgTourPointsSchema = new SimpleSchema({
  "organizerId":{
    type:String,
    label:"id",
  },
  "year":{
    type:String,
    label:"a id",
  },
  "tournaments":{
    type:[String],
    label:"list of tournaments",
    optional:true,
  },
})

orgTourPoints.attachSchema(orgTourPointsSchema);