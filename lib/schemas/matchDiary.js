matchDiary = new Meteor.Collection('matchDiary');

scoresSchema = new SimpleSchema ({
  "setScoresA": {
    type: [Number],
    label: "Set scores of Player-A"
  },
  "setScoresB": {
    type: [Number],
    label: "Set scores of Player-B"
  },
});


var matchDiarySchema  =  new SimpleSchema({
	"playerAId":{
		type:String,
		label:"playerA Id"
	},
	"playerBId":{
		type:String,
		label:"playerB Id",
		optional:true
	},
	"scores": {
    	type: scoresSchema,
    	label: "Scores of the match",
  	},
  	"matchDate":{
  		type:Date,
  		label:"Match Date"
  	},
  	"winnerId":{
  		type:String,
  		label:"winner id",
  		defaultValue:""
  	},
  	"webLink":{
  		type:String,
  		label:"web link",
  		optional:true
  	},

	"sharedTo":{
		type:[String],
		label:"shared to",
		optional:true
	},
	"timeStamp":{
		type : Date,
		autoValue : function() {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpdate) {
				return new Date();
			} else {
				this.unset();
			}
		}
	},
	
});
matchDiary.attachSchema(matchDiarySchema);