MasterMatchCollections = new Meteor.Collection('MasterMatchCollections');

MasterMatchCollectionsSchema = new SimpleSchema ({
  "projectId":{
    type: String,
    label: "Id of project"
  },
  "projectMainName":{
    type: String,
    label: "Name of project"
  },
  "noofSets":{
    type: String,
    label: "Number of sets"
  },
  "minScores":{
    type: String,
    label: "minimum score"
  },
  "points":{
    type: String,
    label: "points"
  },
  "minDifference":{
    type: String,
    label: "minimum difference"
  }
  });

MasterMatchCollections.attachSchema(MasterMatchCollectionsSchema);