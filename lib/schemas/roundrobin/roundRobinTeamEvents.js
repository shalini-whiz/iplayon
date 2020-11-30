roundRobinTeamEvents = new Meteor.Collection('roundRobinTeamEvents');


teamIDSchema = new SimpleSchema ({
  "teamAId" : {
    type:String,
    label:"teamAId",
    defaultValue:""

  },
  "teamBId" : {
    type:String,
    label:"teamBId",
    defaultValue:""
  }
});

winSchema = new SimpleSchema ({
  "teamA" : {
    type:Number,
    label:"teamA",
  },
  "teamB" : {
    type:Number,
    label:"teamB",
  }
});

scoresSchema = new SimpleSchema ({
  "setScoresA": {
    type: [Number],
    label: "Set scores of Player-A"
  },
  "setScoresB": {
    type: [Number],
    label: "Set scores of Player-B"
  }
});


groupDetailsSchema = new SimpleSchema ({
	"rowNo" : {
	    type: Number,
	    label: "rowNo",
	},
	"colNo": {
	    type: Number,
	    label: "colNo",
	},
	"teamsID":{
		type: teamIDSchema,
    	label: "Names of the players/teams",
	},
	"setWins":{
		type: winSchema,
    	label: "win of the players/teams",
	},
	"scores":{
		type: scoresSchema,
    	label: "scores of the players/teams",
	},
	"detailedScore":{
		type:String,
		label:"detailedScore",
		optional:true
	},
    "winnerID":{
		type:String,
		label:"winnerID",
		optional:true
	},
	"loserID":{
		type:String,
		label:"loserID",
		optional:true
	},
	"status":{
		type:String,
		label:"status",
		optional:true
	},
	
});

groupStandingSchema = new SimpleSchema ({
	"rowNo" : {
	    type: Number,
	    label: "rowNo",
	},
	"teamId":{
		type:"String",
		label:"teamId",
		optional:true
	},
	"groupStanding": {
	    type: Number,
	    label: "colNo",
	},
	"points":{
		type:Number,
		label:"points"
	},
	"matchOrder":{
		type: String,
	    label: "playerId",
	    optional:true
	}
});

orderPlaySchema = new SimpleSchema ({
	"groupMem" : {
	    type: Number,
	    label: "rowNo",
	    optional:true
	},
	"matchOrder":{
		type: [String],
	    label: "matchOrder",
	    optional:true
	}
});


var roundRobinTeamEventsSchema  =  new SimpleSchema({
	tournamentId:{
		type:String,
		label:"tournamentId"
	},
	eventName:{
		type:String,
		label:"eventName"
	},
	groupName:{
		type:String,
		label:"groupName"
	},
	groupNumber:{
		type:Number,
		label:"groupNumber"
	},
	groupDetails:{
		type:[groupDetailsSchema],
		label:"groupDetails"
	},
	groupMaxSize:{
		type:Number,
		label:"Group Max Size"
	},
	groupStandingInfo:{
		type:[groupStandingSchema],
		label:"group standings"
	},
	"orderPlay":{
		type:[orderPlaySchema],
		label:"order play"
	}
});
roundRobinTeamEvents.attachSchema(roundRobinTeamEventsSchema);	

