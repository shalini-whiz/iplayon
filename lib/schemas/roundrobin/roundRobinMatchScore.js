matchDetailSchema = new SimpleSchema({
	"no":{
		type:Number,
		label:"Match No"
	},
	"teamAplayerAID":{
		type:String,
		label:"playerAID",
	},
	"teamAplayerBID":{
		type:String,
		label:"playerBID",
    	defaultValue:"",
    	optional:true
	},
	"teamBplayerAID":{
		type:String,
		label:"playerAID",
	},
	"teamBplayerBID":{
		type:String,
		label:"playerBID",
    	defaultValue:"",
    	optional:true

	},
	"matchType":{
		type:String,
		label:"type of match",
	},
	"setScoresA":{
		type:[String],
		label:"setScoresA",
	},
	"setScoresB":{
		type:[String],
		label:"setScoresB",
	},
	"winnerA":{
		type:String,
		label:"winnerId",
	},
	"winnerB":{
		type:String,
		label:"winnerId",
    	defaultValue:"",
    	optional:true
	},
	"winnerIdTeam":{
		type:String,
		label:"winnerIdTeam",
	}
});



matchDetScore = new SimpleSchema ({
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
	matchDetails:{
		type:[matchDetailSchema],
		label:"Match details"
	},
	
});

roundRobinMatchScore = new Meteor.Collection('roundRobinMatchScore');

var roundRobinMatchScoreSchema  =  new SimpleSchema({
	"tournamentId":{
		type:String,
		label:"tournamentId"
	},
	"eventName":{
		type:String,
		label:"eventName"
	},
	"detailScore" :{
		type:[matchDetScore],
		label:"team details"
	}
});
roundRobinMatchScore.attachSchema(roundRobinMatchScoreSchema);	