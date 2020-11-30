matchTeam = new SimpleSchema({
	"playerAID":{
		type:String,
		label:"playerAID",
	},
	"playerBID":{
		type:String,
		label:"playerBID",
	},
	"setScoresA":{
		type:[String],
		label:"setScoresA",
	},
	"setScoresB":{
		type:[String],
		label:"setScoresB",
	},
	"winnerIdPlayer":{
		type:String,
		label:"winnerId",
	},
	"matchType":{
		type:String,
		label:"type of match",
	},
	"winnerIdTeam":{
		type:String,
		label:"winnerIdTeam",
	}
});

matchDoubleTeam = new SimpleSchema({
 	"teamAD1PlayerId":{
 		type:String,
		label:"d1 player id of team a",
 	},
 	"teamAD2PlayerId":{
 		type:String,
		label:"d2 player id of team a",
 	},
 	"teamBD1PlayerId":{
 		type:String,
		label:"d1 player id of team b",
 	},
 	"teamBD2PlayerId":{
 		type:String,
		label:"d2 player id of team b",
 	},
 	"matchType":{
		type:String,
		label:"type of match",
	},
	"winnerIdTeam":{
		type:String,
		label:"winnerId",
	},
	"winnerD1PlayerId":{
		type:String,
		label:"winnerId",
	},
	"winnerD2PlayerId":{
		type:String,
		label:"winnerId",
	},
	"setScoresA":{
		type:[String],
		label:"setScoresA",
	},
	"setScoresB":{
		type:[String],
		label:"setScoresB",
	},
});

teamsDetScore = new SimpleSchema ({
	"matchNumber" : {
	    type: Number,
	    label: "The unique match number within the said event",
	    optional:true,
	},
	"roundNumber": {
	    type: Number,
	    label: "The round to which this match belongs to",
	    optional:true,

	},
    teamAID:{
		type:String,
		label:"teamAID",
	},
	teamBID:{
		type:String,
		label:"teamBID",
	},
	finalTeamWinner:{
		type:String,
		label:"ultimate winner"
	},
	teamMatchType:{
		type:String,
		label:"Type of match"
	},
	matchAVSX:{
		type:matchTeam,
		label:"match a vs x"
	},
	matchBVsY:{
		type:matchTeam,
		label:"match b vs y"
	},
	matchBVsX:{
		type:matchTeam,
		label:"match b vs x"
	},
	matchAVsY:{
		type:matchTeam,
		label:"match a vs y"
	},
	matchDoubles:{
		type:matchDoubleTeam,
		label:"match doubles score"
	}
});

teamRRDetailScore = new Meteor.Collection('teamRRDetailScore');

var teamDetailedScoresSchema  =  new SimpleSchema({
	tournamentId:{
		type:String,
		label:"tournamentId"
	},
	eventName:{
		type:String,
		label:"eventName"
	},
	teamDetailScore :{
		type:[teamsDetScore],
		label:"team details"
	}
});
teamRRDetailScore.attachSchema(teamDetailedScoresSchema);	