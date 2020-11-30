fitbitTokens = new Meteor.Collection('fitbitTokens');

var fitbitTokensSchema  =  new SimpleSchema({
	"appUserID":{
		type:String,
		label:"Fitbit user Id"
	},
	"accessToken":{
		type:String,
		label:"Fitbit accessToken",
	},
	"refreshToken":{
		type:String,
		label:"Fitbit refreshToken",
	},
	"userId":{
		type:String,
		defaultValue:""
	}
});
fitbitTokens.attachSchema(fitbitTokensSchema);