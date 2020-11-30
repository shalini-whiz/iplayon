
var masterValue = new SimpleSchema({
	"defaultValue":{
		type:String,
		label:"default value",
		optional:true
	},
	"valueSet":{
		type:String,
		label:"value set"
	},
})

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

var destinationTypeMaster = new SimpleSchema ({
   "defaultValue" : {
    type: String,
    defaultValue:"P6",
  },
  "valueSet" : {
    type: [String],
    defaultValue:"",
  }
});

destinationPointsMaster = new Meteor.Collection('destinationPointsMaster');

var destinationPointsMasterSchema  =  new SimpleSchema({
	sportId:{
		type:masterValue,
		label:"Destination Sport"
	},
	destinationShortName:{
		type:masterValue,
		label:"Destination Short Code"
	},
	destinationName:{
		type:masterValue,
		label:"Destination Name",
	},
	destinationComment:{
		type:masterValue,
		label:"Destination comment",
		optional:true
	},
	destinationType:{
		type:destinationTypeMaster,
		label:"Destination type",
	},
	
});
destinationPointsMaster.attachSchema(destinationPointsMasterSchema);

/*************************************************************************************/


destinationPoints = new Meteor.Collection('destinationPoints');
var destinationPointsSchema  =  new SimpleSchema({
	sportId:{
		type:String,
		label:"Destination Sport"
	},
	destinationShortName:{
		type:String,
		label:"Destination Short Code"
	},
	destinationName:{
		type:String,
		label:"Destination Name",
	},
	destinationComment:{
		type:String,
		label:"Destination comment",
		optional:true
	},
	destinationType:{
		type:String,
		label:"Destination type",
	},
});
destinationPoints.attachSchema(destinationPointsSchema);


/*********** p6 destination table *********************/
p6DestinationPointsMaster = new Meteor.Collection('p6DestinationPointsMaster');

var p6DestinationPointsMasterSchema  =  new SimpleSchema({
	destinationShortName:{
		type:masterArraySchema,
		label:"Master P6 Destination Code",
	},
	destinationName:{
		type:masterArraySchema,
		label:"Master P6 Destination Name",
	},
	
});
p6DestinationPointsMaster.attachSchema(p6DestinationPointsMasterSchema);

p6DestinationPoints = new Meteor.Collection('p6DestinationPoints');
var p6DestinationPointsSchema  =  new SimpleSchema({
	
	destinationShortName:{
		type:String,
		label:"P6 Destination Code",
	},
	destinationName:{
		type:String,
		label:"P6 Destination Name",
	},
	
});
p6DestinationPoints.attachSchema(p6DestinationPointsSchema);


/*************** p8 destination table *******************/
p8DestinationPointsMaster = new Meteor.Collection('p8DestinationPointsMaster');

var p8DestinationPointsMasterSchema  =  new SimpleSchema({
	destinationShortName:{
		type:masterArraySchema,
		label:"Master P8 Destination Code",
	},
	destinationName:{
		type:masterArraySchema,
		label:"Master P8 Destination Name",
	},
	
});
p8DestinationPointsMaster.attachSchema(p8DestinationPointsMasterSchema);

p8DestinationPoints = new Meteor.Collection('p8DestinationPoints');
var p8DestinationPointsSchema  =  new SimpleSchema({
	
	destinationShortName:{
		type:String,
		label:"P8 Destination Code",
	},
	destinationName:{
		type:String,
		label:"P8 Destination Name",
	},
	
});
p8DestinationPoints.attachSchema(p8DestinationPointsSchema);


/***************** p9 destination table *************************/

p9DestinationPointsMaster = new Meteor.Collection('p9DestinationPointsMaster');

var p9DestinationPointsMasterSchema  =  new SimpleSchema({
	destinationShortName:{
		type:masterArraySchema,
		label:"Master P9 Destination Code",
	},
	destinationName:{
		type:masterArraySchema,
		label:"Master P9 Destination Name",
	},
	
});
p9DestinationPointsMaster.attachSchema(p9DestinationPointsMasterSchema);

p9DestinationPoints = new Meteor.Collection('p9DestinationPoints');
var p9DestinationPointsSchema  =  new SimpleSchema({
	destinationShortName:{
		type:String,
		label:"P9 Destination Code",
	},
	destinationName:{
		type:String,
		label:"P9 Destination Name",
	},
	
});
p9DestinationPoints.attachSchema(p9DestinationPointsSchema);


/************** p14 destination table **********************/

p14DestinationPointsMaster = new Meteor.Collection('p14DestinationPointsMaster');

var p14DestinationPointsMasterSchema  =  new SimpleSchema({
	destinationShortName:{
		type:masterArraySchema,
		label:"Master P14 Destination Code",
	},
	destinationName:{
		type:masterArraySchema,
		label:"Master P14 Destination Name",
	},
	
});
p14DestinationPointsMaster.attachSchema(p14DestinationPointsMasterSchema);

p14DestinationPoints = new Meteor.Collection('p14DestinationPoints');
var p14DestinationPointsSchema  =  new SimpleSchema({
	destinationShortName:{
		type:String,
		label:"P14 Destination Code",
	},
	destinationName:{
		type:String,
		label:"P14 Destination Name",
	},
	
});
p14DestinationPoints.attachSchema(p14DestinationPointsSchema);




