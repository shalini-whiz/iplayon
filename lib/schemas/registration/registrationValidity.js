registrationValidity = new Meteor.Collection('registrationValidity');

var registrationValiditySchema  =  new SimpleSchema({
	"userId":{
		type:String,
		label:"User Id"
	},
	"validity":{
		type:Date,
		label:"User Validity",
	},
	"year":{
		type:Number,
		label:"year"
	},
	"status":{
		type:String,
		label:"User Status",
		defaultValue:"active"
	},
});
registrationValidity.attachSchema(registrationValiditySchema);