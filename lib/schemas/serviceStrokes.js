

serviceStrokesMaster = new Meteor.Collection('serviceStrokesMaster');

var masterSchema = new SimpleSchema ({
   "defaultValue" : {
    type: String,
    defaultValue:"",
  },
  "valueSet" : {
    type: String,
    defaultValue:"",
  }
});

var masterArraySchema = new SimpleSchema ({
   "defaultValue" : {
    type: String,
    defaultValue:"",
  },
  "valueSet" : {
    type: [String],
    defaultValue:"",
  }
});


var serviceStrokesMasterSchema  =  new SimpleSchema({
	sportId:{
		type:masterSchema,
		label:"Service Sport"
	},
	serviceHand:{
		type:masterSchema,
		label:"Service Hand",
		optional:true
	},
	serviceShortName:{
		type:masterArraySchema,
		label:"Service Short Code"
	},
	serviceName:{
		type:masterArraySchema,
		label:"Service Short Name",
	},
	serviceComment:{
		type:masterSchema,
		label:"Service comment",
		optional:true
	},
});

serviceStrokesMaster.attachSchema(serviceStrokesMasterSchema);


serviceStrokes = new Meteor.Collection('serviceStrokes');
var serviceStrokesSchema  =  new SimpleSchema({
	sportId:{
		type:String,
		label:"Service Sport"
	},
	serviceHand:{
		type:String,
		label:"Service Hand",
		optional:true
	},
	serviceShortName:{
		type:String,
		label:"Service Short Code"
	},
	serviceName:{
		type:String,
		label:"Service Short Name",
	},
	serviceComment:{
		type:String,
		label:"Service comment",
		optional:true
	},
});
serviceStrokes.attachSchema(serviceStrokesSchema);