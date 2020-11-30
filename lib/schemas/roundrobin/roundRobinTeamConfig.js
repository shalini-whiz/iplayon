roundRobinTeamConfig = new Meteor.Collection('roundRobinTeamConfig');

var roundRobinTeamConfigSchema  =  new SimpleSchema({
	"tournamentId":{
		type:String,
		label:"tournamentId"
	},
	"eventName":{
		type:String,
		label:"eventName"
	},
	"projectId":{
		type:String,
		label:"projectId"
	},
	"matchFormatId":{
		type:String,
		label:"matchFormatId"
	}
});
roundRobinTeamConfig.attachSchema(roundRobinTeamConfigSchema);	
