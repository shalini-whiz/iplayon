analyticsRequest = new Meteor.Collection('analyticsRequest');

var analyticsRequestSchema  =  new SimpleSchema({

	userId:{
		type:String,
		label:"Request User Id"
	},
	title:{
		type:String,
		label:"Match Title"
	},
	link:{
		type:String,
		label:"Match Link"
	},
	matchDate:{
		type:Date,
		label:"Match date"
	},
	description:{
		type:String,
		label:"Match Description",
		optional:true
	},
	status:{
		type:String,
		label:"Match Status",
		defaultValue:"active"
	},
	analystId:{
		type:String,
		label:"Analyst User Id"
	},
	fee:{
		type:Number,
		label:"Match fee"
	},
	transactionId:{
		type:String,
		label:"Transaction Id",
		optional:true
	},
	transactionStatus:{
		type:String,
		label:"Transaction status",
		defaultValue:"paid"
	},
	requestedOn:{
		type:Date,
		label:"Match requestedOn",
	},
	completedOn:{
		type:Date,
		label:"Match completedOn",
		optional:true
	},
	sequenceId:{
		type:String,
		label : "Match sequenceId",
		optional:true
	}
});
analyticsRequest.attachSchema(analyticsRequestSchema);