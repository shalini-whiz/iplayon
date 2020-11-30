
playerSequence = new Meteor.Collection('playerSequence');

var strokesArr = new SimpleSchema({
	"strokePlayed":{
		type:String,
		label:"stroke player name",
		optional:true

	},
	"strokeHand":{
		type:String,
		label:"player stroke hand"

	},
	"strokeDestination":{
		type:String,
		label:"player stroke destination"

	}
})

var summaryArr = new SimpleSchema ({
  	"strokeKey":{
  		type:String,
  		label:"player1 stroke"
  	},
	"strokesPlayed":{
  		type:Number,
  		label:"total strokes"
  	},
  	"win":{
  		type:Number,
  		label:"Win count"
  	},
  	"loss":{
  		type:Number,
		label:"Loss count"
  	}
});

playerSetSchema = new SimpleSchema ({
  "set" : {
    type: String,
    label: "Player set",
    optional:true
  },
  "points" : {
    type: String,
    label: "Player points",
    optional:true
  }
});


var sequenceArr = new SimpleSchema ({
  	
  	"sequenceName":{
  		type:String,
  		label:"Sequence Name",
      optional:true
  	},
	 "serviceBy":{
  		type:String,
  		label:"Service By"
  	},
  	"serviceHand":{
  		type:String,
  		label:"Service Hand"
  	},
  	"serviceDestination":{
  		type:String,
  		label:"Service Hand"
  	},
    "serviceKey":{
      type:String,
      label:"Service Key"
    },
    "serviceWin":{
      type:Number,
      label:"Service Win",
      optional:true
    },
    "serviceLoss":{
      type:Number,
      label:"Service Loss",
      optional:true
    },
  	"strokesPlayed":{
  		type:[strokesArr],
		  label:"strokesPlayed"
  	},
  	"combinedStrokes":{
  		type:[String],
  		label:"combinedStrokes"
  	},
  	"p1Analytics":{
  		type:[summaryArr],
  		label:"p1 stroke Summary"	
	  },
    "p2Analytics":{
      type:[summaryArr],
      label:"p2 stroke Summary"  
    },
  	"winner":{
  		type:String,
  		label:"winner status"
  	},
  	"playerA":
  	{
    	type: playerSetSchema,
    	label: "playerA set",
    	optional:true
  	},
  	"playerB":
  	{
    	type: playerSetSchema,
    	label: "playerB set",
    	optional:true
  	},
  	"sequenceDate":
  	{
  		type:Date
  	},
  	

});

var playerSequenceSchema  =  new SimpleSchema({
	playerId:{
		type:String,
		label:"sequence recorded by"
	},
	player1Name:{
		type:String,
		label:"Player1 Name"
	},
	player1Hand:{
		type:String,
		label:"Player1 Hand"
	},
	player2Name:{
  		type:String,
  		optional:true
  	},
  	player2Hand:{
		type:String,
		label:"Player2 Hand",
		optional:true
	},
	sequence:{
		type:[sequenceArr],
		label:"Player Sequence"
	}
	/*
{
  	
  	"sequenceName":{
  		type:String,
  		label:"Sequence Name"
  	},
	"serviceBy":{
  		type:String,
  		label:"Service By"
  	},
  	"serviceHand":{
  		type:String,
  		label:"Service Hand"
  	},
  	"serviceDestination":{
  		type:String,
  		label:"Service Hand"
  	},
  	"strokesPlayed":{
  		type:[strokesArr],
		label:"strokesPlayed"
  	},
  	"combinedStrokes":{
		type:[String],
		label:"combinedStrokes"
  	},
  	"strokesPlayedSummary":{
		type:[summaryArr],
		label:"each Player stroke Summary"	
	},
  	"winner":{
  		type:String,
  		label:"winner status"
  	},
  	"playerA":
  	{
    	type: playerSetSchema,
    	label: "playerA set",
    	optional:true
  	},
  	"playerB":
  	{
    	type: playerSetSchema,
    	label: "playerB set",
    	optional:true
  	},
  	"sequenceDate":
  	{
  		type:Date
  		}
  		}

	*/
	
});
playerSequence.attachSchema(playerSequenceSchema);



playerAnalyticsSequence = new Meteor.Collection('playerAnalyticsSequence');
var playerAnalyticsSequenceSchema  =  new SimpleSchema({
	"player1Name":{
		type:String,
		label:"Player1 Name"
	},
	"player2Name":{
  		type:String,
  		optional:true
  	},
	strokeSummary:{
		type:[summaryArr],
		label:"analyze Player strokeSummary"
	}
	
});

