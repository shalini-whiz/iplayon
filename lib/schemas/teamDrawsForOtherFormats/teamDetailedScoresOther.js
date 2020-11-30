matchTeamOth = new SimpleSchema({
	"no":{
		type:Number,
		label:"specification No",
	},
	"displayLabel": {
	    type: String,
	    label: "to display unique label (can contain space) for each match type",
	},
	"label":{
	    type: String,
	    label: "to use unique label (without space) for each match type",
	},
	"order":{
		type:Number,
		label:"order of this match"
	},
	"playerAId":{
		type:String,
		label:"playerAID",
	},
	"playerBId":{
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
	},
	"playerA1Id":{
 		type:String,
		label:"d1 player id of team a",
 	},
 	"playerA2Id":{
 		type:String,
		label:"d2 player id of team a",
 	},
 	"playerB1Id":{
 		type:String,
		label:"d1 player id of team b",
 	},
 	"playerB2Id":{
 		type:String,
		label:"d2 player id of team b",
 	},
	"winnerD1PlayerId":{
		type:String,
		label:"winnerId",
	},
	"winnerD2PlayerId":{
		type:String,
		label:"winnerId",
	},
	"matchProjectType":{
		type:String,
		label:"singles or doubles"
	}
});


teamsDetScoreOth = new SimpleSchema ({
	"thirdFourthRound" : {
		type:Boolean,
		label:"3rd and 4th round"
	},
	"matchNumber" : {
	    type: Number,
	    label: "The unique match number within the said event",
	},
	"roundNumber": {
	    type: Number,
	    label: "The round to which this match belongs to",
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
	specifications:{
		type:[matchTeamOth],
		label:"Array of specifications"
	}
});

teamDetailedScoresOthrFormat = new Meteor.Collection('teamDetailedScoresOthrFormat');

var teamDetailedScoresOthrFormatSchema  =  new SimpleSchema({
	tournamentId:{
		type:String,
		label:"tournamentId"
	},
	eventName:{
		type:String,
		label:"eventName"
	},
	teamDetScore :{
		type:[teamsDetScoreOth],
		label:"team details"
	},
	orgTeamFormatId:{
		type:String,
		label:"id of the team format created by that organizer"
	}
});
teamDetailedScoresOthrFormat.attachSchema(teamDetailedScoresOthrFormatSchema);	