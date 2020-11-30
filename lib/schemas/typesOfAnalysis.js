typesOfAnalysis = new Meteor.Collection('typesOfAnalysis');

var typesOfAnalysisSchema = new SimpleSchema ({
	"key":{
   type: String,
    defaultValue:"",
	},
   "typeOfAnalysis" : {
    type: String,
    defaultValue:"",
  },
  "description" : {
    type: String,
    defaultValue:"",
  }
});

typesOfAnalysis.attachSchema(typesOfAnalysisSchema);