roundRobinEvents = new Meteor.Collection('roundRobinEvents');


playersIDSchema = new SimpleSchema ({
  "playerAId" : {
    type:String,
    label:"playerAId",
    defaultValue:""

  },
  "playerBId" : {
    type:String,
    label:"playerBId",
    defaultValue:""
  }
});

winSchema = new SimpleSchema ({
  "playerA" : {
    type:Number,
    label:"playerA",
  },
  "playerB" : {
    type:Number,
    label:"playerB",
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
	"playersID":{
		type: playersIDSchema,
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
	"playerId" : {
	    type: String,
	    label: "playerId",
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
	    label: "matchOrder",
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



var roundRobinEventsSchema  =  new SimpleSchema({
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
roundRobinEvents.attachSchema(roundRobinEventsSchema);	

