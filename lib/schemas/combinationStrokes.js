




playerNameEntries = new Meteor.Collection('playerNameEntries');
var playerNameEntriesSchema  =  new SimpleSchema({
	playerId:{
		type:String,
		label:"Destination Short Code"
	},
	playerListArr:{
		type:[String],
		label:"Player Name Entries Array",
		optional:true
	},
	accessRights:{
		type:String,
		label:"accessRights",
		optional:true
	},
	sharedWith:{
		type:[String],
		label:"shared with",		
		optional:true
	},
	sharedBy:{
		type:[String],
		label:"sharedBy",
		optional:true
	} 
});
playerNameEntries.attachSchema(playerNameEntriesSchema);


var summarystrokeArr = new SimpleSchema ({
  	"strokeKey":{
  		type:String,
  		label:"player1 stroke"
  	},
	"strokesPlayed":{
  		type:String,
  		label:"total strokes"
  	},
  	"win":{
  		type:String,
  		label:"Win count"
  	},
  	"loss":{
  		type:String,
		label:"Loss count"
  	},
  	"efficiency":{
  		type:String,
		label:"efficiency count",
		optional:true,
		defaultValue:"0"
  	},
  	"strokeHand":{
  		type:String,
  		optional:true
  	},
  	"strokeDestination":{
  		type:String,
  		optional:true
  	}
});



combinationStroke = new Meteor.Collection('combinationStroke');
var combinationStrokeSchema  =  new SimpleSchema({
	stroke1:{
		type:String,
		label:"Destination Short Name",
		optional:true
	},
	stroke2:{
		type:String,
		label:"Destination comment",
		optional:true
	},
	combinedStroke:{
		type:[String],
		label:"Combined Stroke"
	},
	combinedStrokeValue:{
		type:[String],
		label:"Combined Stroke Value",
		optional:true
	},
	combinedStrokeArr:{
		type:[summarystrokeArr],
		label:"combined json"
	}
});
combinationStroke.attachSchema(combinationStrokeSchema);