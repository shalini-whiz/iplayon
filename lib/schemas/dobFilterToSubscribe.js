dobFilterSubscribe = new Meteor.Collection('dobFilterSubscribe');

var dobFilterSubscribeSchema  =  new SimpleSchema({
	eventOrganizer:{
		type:String,
		label:"eventOrganizer user id",
		optional:true
	},
	mainProjectId:{
		type:String,
		label:"sport id",
		optional:true
	},
	"details.$.eventId":{
		type:String,
		label:"Event Id",
		optional:true
	},	
	"details.$.dateOfBirth":{
		type:String,
		label:"on or before",
		optional:true
	},
	"details.$.gender":{
		type:String,
		label:"gender filter",
		optional:true
	},
	"details.$.ranking":{
		type:String,
		label:"allow ranking",
		optional:true
	},
	"tournamentId":{
		type:String,
		label:"allow ranking",
		optional:true
	}
});
dobFilterSubscribe.attachSchema(dobFilterSubscribeSchema);