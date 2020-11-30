liveScores = new Meteor.Collection('liveScores');


var teamMatchSchema = new SimpleSchema ({
  "matchType": {
    type: String,
    label: "Match type"
  },
  "matchStatus": {
    type: String,
    label: "Match Status"
  },
  "matchTitle":{
  	type: String,
    label: "Match Title"
  },
  "matchNumber":{
  	type:Number,
  	label:"Match Number"
  },
  "scoresA": {
    type: [String],
    label: "Set scores of Player-A"
  },
  "scoresB": {
    type: [String],
    label: "Set scores of Player-B"
  },
  "teamAPlayerAID":{
  	type:String,
  	label:"Team A - PlayerA"
  },
  "teamAPlayerBID":{
  	type:String,
  	label:"Team A - PlayerB",
  	optional:true
  },
  "teamBPlayerAID":{
  	type:String,
  	label:"Team B - PlayerA"
  },
  "teamBPlayerBID":{
  	type:String,
  	label:"Team B - PlayerB",
  	optional:true
  }
});

var liveScoresSchema  =  new SimpleSchema({
	"tournamentId":{
		type:String
	},
	"eventName":{
		type:String,
	},
	"projectType":{
		type:Number,
	},
	"eventOrganizer":{
		type:String
	},
	"matchNumber":{
		type:Number
	},
	"roundNumber":{
		type:Number
	},
	"roundName":{
		type:String
	},
	"status":{
		type:String
	},
	"playerAId":{
		type:String
	},
	"playerBId":{
		type:String
	},
	"scoresA": {
    	type: [String],
    	label: "Set scores of Player-A"
  	},
  	"scoresB": {
    	type: [String],
    	label: "Set scores of Player-B"
  	},
  	"teamMatchDetails":{
  		type:[teamMatchSchema],
  		label:"Team Match Details",
  		optional:true
  	},
  	"logTime" : {
		type : Date,
		autoValue : function() {
			if (this.isInsert) {
				return new Date();
			} 
			else if (this.isUpsert) 
			{
				return {
					$setOnInsert : new Date()
				};
			} 
			else if (this.isUpdate) {
				return new Date();
			}

			else {
				this.unset();
			}
		}
	},

	
});
liveScores.attachSchema(liveScoresSchema);