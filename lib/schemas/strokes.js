strokesMaster = new Meteor.Collection('strokesMaster');

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


var strokesMasterSchema  =  new SimpleSchema({
	sportId:{
		type:masterSchema,
		label:"Stroke Sport"
	},
	strokeHand:{
		type:masterSchema,
		label:"Stroke Hand",
		optional:true
	},
	strokeShortCode:{
		type:masterArraySchema,
		label:"Stroke Short Code"
	},
	strokeName:{
		type:masterArraySchema,
		label:"Stroke Short Name",
	},
	strokeComment:{
		type:masterSchema,
		label:"Stroke comment",
		optional:true
	},
	strokeStyle:{
		type:masterArraySchema,
		optional:true,
	}
});
strokesMaster.attachSchema(strokesMasterSchema);






strokes = new Meteor.Collection('strokes');
var strokesSchema  =  new SimpleSchema({
	sportId:{
		type:String,
		label:"Stroke Sport"
	},
	strokeHand:{
		type:String,
		label:"Stroke Hand",
		optional:true
	},
	strokeShortCode:{
		type:String,
		label:"Stroke Short Code"
	},
	strokeName:{
		type:String,
		label:"Stroke Short Name",
	},
	strokeComment:{
		type:String,
		label:"Stroke comment",
		optional:true
	},
	strokeStyle:{
		type:String,
		optional:true,
	}
});
strokes.attachSchema(strokesSchema);




/**************************** losing strokes *************************************/
losingStrokes = new Meteor.Collection('losingStrokes');
var losingStrokesSchema  =  new SimpleSchema({
	
	losingStrokes:{
		type:[String],
		label:"losing strokes"
	},

});
losingStrokes.attachSchema(losingStrokesSchema);