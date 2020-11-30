registrationTransaction = new Meteor.Collection('registrationTransaction');

var registrationTransactionSchema  =  new SimpleSchema({
	
	"userId":{
		type:String,
		label:"Player ID",
	},
	"associationId":{
		type:String,
		label:"associationId",
		optional:true
	},
	"transactionId":{
		type:String,
		label:"Transaction ID",
	},
	"transactionFee":{
		type:String,
		label:"Transaction Fee",
		optional:true
	},
	"transactionDate":{
		type:Date,
		defaultValue:new Date()
	}
});
registrationTransaction.attachSchema(registrationTransactionSchema);