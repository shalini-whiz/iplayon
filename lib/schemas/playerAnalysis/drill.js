drill = new Meteor.Collection('drill');

var drillSchema  =  new SimpleSchema({
	"name":{
		type:String,
		label:"drill name"
	},
	"description":{
		type:String,
		label:"drill description",
	},
	"intensity":{
		type:[String],
		label:"drill intensity",
		optional:true
	},
	"duration":{
		type:Number,
		label:"drill duration"
	},
	"durationType":{
		type:String,
		label:"drill durationType"
	},
	"type":{
		type:String,
		label:"drill type"
	},
	"status":{
		type:String,
		label:"drill status",
		defaultValue:"active"
	},
	"userId":{
		type:String,
		label:"drill userId"
	}
});
drill.attachSchema(drillSchema);