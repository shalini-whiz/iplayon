playerDetailsMasterData = new Meteor.Collection('playerDetailsMasterData');

var masterSchema = new SimpleSchema ({
   "defaultValue" : {
    type: String,
    defaultValue:"",
  },
  "valueSet" : {
    type: String,
    defaultValue:"",
  }
});

var masterDateSchema = new SimpleSchema ({
   "defaultValue" : {
    type: Date,
    defaultValue:"",
  },
  "valueSet" : {
    type: String,
    defaultValue:"",
  }
});

var masterPlayerHandSchema = new SimpleSchema ({
   "defaultValue" : {
    type: String,
    defaultValue:"Unknown",
  },
  "valueSet" : {
    type: String,
    defaultValue:"",
  }
});






var playerDetailsMasterSchema  =  new SimpleSchema({
	"loggerId":{
		type:masterSchema,
		label:"Logger Id"
	},
	
	"playerName":{
		type:masterSchema,
		label:"Player Name",
	},
	
	"playerHand":{
		type:masterPlayerHandSchema,
		label:"Player Hand",
	},
	"foreHandRT.rubberDate":{
		type:masterDateSchema,
		label:"ForeHand Rubber Date",
		optional:true
	},
	"foreHandRT.rubberType":{
		type:masterSchema,
		label:"ForeHand Rubber Type",
		optional:true
	},
	"backHandRT.rubberDate":{
		type:masterDateSchema,
		label:"BackHand Rubber Date",
		optional:true
	},
	"backHandRT.rubberType":{
		type:masterSchema,
		label:"BackHand Rubber Type",
		optional:true
	},
		
});
playerDetailsMasterData.attachSchema(playerDetailsMasterSchema);


/******************************** actual record ******************************************/

playerDetailsRecord = new Meteor.Collection('playerDetailsRecord');

var RubberType = new SimpleSchema ({
  "rubberDate":{
    type:Date,
    label:"Rubber Date",
  },
  "rubberType":{
    type:String,
    label:"Rubber Type"
  }
});


var playerDetailsSchema  =  new SimpleSchema({
	loggerId:{
		type:String,
		label:"Logger Id"
	},
	sportId:{
		type:String,
		label:"Sport Id",
		optional:true
	},
	playerName:{
		type:String,
		label:"Player Name"
	},
	userId:{
		type:String,
		label:"registerd id",
		optional:true
	},
	playerHand:{
		type:String,
		label:"Player Hand",
		optional:true,
		allowedValues: ['Unknown', 'LeftHand', 'RightHand'],
	},
	foreHandRT:{
		type:[RubberType],
		label:"ForeHand Rubber Type",
		optional:true
	},
	backHandRT:{
		type:[RubberType],
		label:"BackHand Rubber Type",
		optional:true
	}	
});
playerDetailsRecord.attachSchema(playerDetailsSchema);