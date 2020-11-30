matchDetailSchema = new SimpleSchema({
	"matchNumber":{
		type:Number,
		label:"Match No"
	},
	"matchTitle":{
		type:String,
		label:"playerAID",
	},
	"matchStatus":{
		type:String,
		label:"matchStatus",
	},
	"matchStatus":{
		type:String,
		label:"matchStatus",
	},
	"teamAPlayerAID":{
		type:String,
		label:"playerAID",
	},
	"teamAPlayerBID":{
		type:String,
		label:"playerBID",
    	defaultValue:"",
    	optional:true
	},
	"teamBPlayerAID":{
		type:String,
		label:"playerAID",
	},
	"teamBPlayerBID":{
		type:String,
		label:"playerBID",
    	defaultValue:"",
    	optional:true

	},
	"matchType":{
		type:String,
		label:"type of match",
	},
	"scoresA":{
		type:[String],
		label:"setScoresA",
	},
	"scoresB":{
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

roundRobinTemp = new Meteor.Collection('roundRobinTemp');

var roundRobinTempSchema  =  new SimpleSchema({
	"tournamentId":{
		type:String,
		label:"tournamentId"
	},
	"eventName":{
		type:String,
		label:"eventName"
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
	matchDetails:{
		type:[matchDetailSchema],
		label:"Match details"
	},
	
});
roundRobinTemp.attachSchema(roundRobinTempSchema);	