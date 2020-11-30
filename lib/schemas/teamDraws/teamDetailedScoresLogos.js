teamDetailedScoresLogos = new Meteor.Collection('teamDetailedScoresLogos');

var teamDetailedScoresLogosSchema  =  new SimpleSchema({
	tournamentId:{
		type:String,
		label:"tournamentId"
	},
	eventName:{
		type:String,
		label:"eventName"
	},
	LogoPAth :{
		type:"String",
		label:"team details"
	}
});
teamDetailedScoresLogos.attachSchema(teamDetailedScoresLogosSchema);	