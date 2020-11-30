sequenceMasterData = new Meteor.Collection('sequenceMasterData');

var masterSchema = new SimpleSchema({
	"defaultValue":{
		type:String,
		label:"default value",
		defaultValue:""
	},
	"valueSet":{
		type:String,
		label:"value set",
		defaultValue:""

	},
})

var masterDefaultArraySchema = new SimpleSchema({
	"defaultValue":{
		type:[String],
		label:"default value",
		defaultValue:[]

	},
	"valueSet":{
		type:[String],
		label:"value set",
		defaultValue:[]
	},
})



var masterDateSchema = new SimpleSchema ({
   "defaultValue" : {
    type: Date,
    defaultValue:new Date()
  },
  "valueSet" : {
    type: String,
    defaultValue:"",
  }
});

var masterRallySchema = new SimpleSchema({
	"defaultValue":{
		type:String,
		label:"default value",
		defaultValue:"complete"
	},
	"valueSet":{
		type:[String],
		label:"value set",
		defaultValue:["partial","complete"]

	},
})

var masterNumberSchema = new SimpleSchema({
	"defaultValue":{
		type:String,
		label:"default value",
		defaultValue:"0"
	},
	"valueSet":{
		type:String,
		label:"value set",
		defaultValue:"0"
	},
}) 

var masterSetSchema = new SimpleSchema({
	"defaultValue":{
		type:String,
		label:"default value",
		defaultValue:""
	},
	"valueSet":{
		type:String,
		label:"value set",
		defaultValue:"0"
	},
}) 


var playerSetMasterSchema = new SimpleSchema ({
  	"set" : {
	    type: masterSetSchema,
	    label: "Player set",

	},
  	"points" : {
	    type: masterSetSchema,
	    label: "Player points",

  	}
});


var summaryArrMaster = new SimpleSchema ({
  	"strokeKey":{
  		type:masterSchema,
  		label:"player1 stroke"
  	},
	"p1Count":{
  		type:masterNumberSchema,
  		label:"p1 total strokes"
  	},
  	"p1Win":{
  		type:masterNumberSchema,
  		label:"p1 Win count"
  	},
  	"p1Loss":{
  		type:masterNumberSchema,
		label:"p1 Loss count"
  	},
  	"p2Count":{
  		type:masterNumberSchema,
  		label:"p2 total strokes"
  	},
  	"p2Win":{
  		type:masterNumberSchema,
  		label:"p2 Win count"
  	},
  	"p2Loss":{
  		type:masterNumberSchema,
		label:"p2 Loss count"
  	}
});


var SequenceInfoMaster = new SimpleSchema ({
	"matchDate":{
    	type:masterDateSchema,
    	label:"Match Date",
    	optional:true
  	},
  	"rallyType":{
    	type:masterRallySchema,
    	label:"Rally Type",
  	},
  	"playerA":{
    	type: playerSetMasterSchema,
    	label: "playerA defaultValue",
  	},
  	"playerB":
  	{
    	type: playerSetMasterSchema,
    	label: "playerB defaultValue",
  	},
  	"sequenceRecordDate":
  	{
  		type:masterDateSchema,
  		label:"Sequence Recorded Date"
  	},
  	"strokesPlayed.strokePlayed":{
  		type:masterSchema,
		label:"master strokesPlayed.strokePlayed"
  	},
  	"strokesPlayed.strokeHand":{
  		type:masterSchema,
		label:"master strokesPlayed.strokeHand"
  	},
  	"strokesPlayed.strokeDestination":{
  		type:masterSchema,
		label:"master strokesPlayed.strokeDestination"
  	},
  	"strokesPlayed.previousDestination":{
  		type:masterSchema,
		label:"master strokesPlayed.previousDestination"
  	},
  	"combinedStrokes":{
  		type:masterDefaultArraySchema,
  		label:"combinedStrokes"
  	},
  	"analyticsCache.serviceBy":{
  		type:masterSchema,
  		label:"Analytics Cache service by"
  	},
  	"analyticsCache.winner":{
  		type:masterSchema,
  		label:"Analytics Cache winner"
  	},
  	"analyticsCache.serviceWin":{
  		type:masterSchema,
  		label:"Analytics Cache serviceWin"
  	},
  	"analyticsCache.serviceLoss":{
  		type:masterSchema,
  		label:"Analytics Cache serviceLoss"
  	},
  	"analyticsCache.sequenceLen":{
  		type:masterSchema,
  		label:"Analytics Cache sequenceLen"
  	},
  	"analyticsCache.winStroke":{
  		type:masterSchema,
  		label:"Analytics Cache winStroke"
  	},
  	"analyticsCache.strokeSum":{
  		type:summaryArrMaster,
  		label:"Analytics Cache strokesum"
  	},
  	"analyticsCache.thirdBall":{
  		type:masterSchema,
  		label:"Master Analytics Cache thirdBall"
  	},
  	"analyticsCache.fourthBall":{
  		type:masterSchema,
  		label:"Master Analytics Cache fourthBall"
  	},
  	"analyticsCache.secondBallShot":{
  		type:masterSchema,
  		label:"Master Analytics Cache secondBallShot"
  	},
  	"analyticsCache.secondBallDestination":{
  		type:masterSchema,
  		label:"Master Analytics Cache secondBallDestination"
  	}

});

var sequenceMasterSchema  =  new SimpleSchema({
	loggerId:{
		type:masterSchema,
		label:"Logger Id"
	},
	player1Name:{
		type:masterSchema,
		label:"Player1 Name"	
	},
	player2Name:{
		type:masterSchema,
		label:"Player2 Name",
	},
	player1Id:{
		type:masterSchema,
		label:"Player1 ID",
	},
	player2Id:{
		type:masterSchema,
		label:"Player2 ID",
	},
	sequence:{
		type:SequenceInfoMaster,
		label:"Sequence List Master"
	}
});
sequenceMasterData.attachSchema(sequenceMasterSchema);









/***************** sequence record ************************************/

sequenceDataRecord = new Meteor.Collection('sequenceDataRecord');


var playerSetSchema = new SimpleSchema ({
  "set" : {
    type: String,
    label: "Player set",
    defaultValue:"",
                optional:true

  },
  "points" : {
    type: String,
    label: "Player points",
    defaultValue:"",
                optional:true




  }
});

var strokesArr = new SimpleSchema({
	"previousDestination":{
		type:String,
		label:"previous destination",
		optional:true
	},
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
	"p1Count":{
  		type:Number,
  		label:"p1 total strokes"
  	},
  	"p1Win":{
  		type:Number,
  		label:"p1 Win count"
  	},
  	"p1Loss":{
  		type:Number,
		label:"p1 Loss count"
  	},
  	"p2Count":{
  		type:Number,
  		label:"p2 total strokes"
  	},
  	"p2Win":{
  		type:Number,
  		label:"p2 Win count"
  	},
  	"p2Loss":{
  		type:Number,
		label:"p2 Loss count"
  	}
});

var AnalyticsCache = new SimpleSchema({
	"serviceBy":{
		type:String,
		label:"Service By",
	},
	"winner":{
		type:String,
		label:"Winner",
    optional:true,
    defaultValue:""
	},
	"serviceWin":{
		type:String,
		label:"Service Win",
		allowedValues: ['yes', 'no'],
	},
	"serviceLoss":{
		type:String,
		label:"Service Loss",
		allowedValues: ['yes', 'no'],
	},
	"sequenceLen":{
		type:Number,
		label:"Sequence Length"
	},
	"winStroke":{
		type:String,
		label:"win stroke",
		optional:true
	},
	"strokeSum":{
		type:[summaryArr],
		label:"stroke sum"
	},
	"thirdBall":{
  		type:String,
  		optional:true
  	},
  	"fourthBall":{
  		type:String,
  		optional:true
  	},
  	"secondBallShot":{
  		type:String,
  		optional:true
  	},
  	"secondBallDestination":{
  		type:String,
  		optional:true
  	},

})


var SequenceInfo = new SimpleSchema ({

  "matchTitle":{
    type:String,
    label:"Match Title",
    optional:true
  },
  "startTime":{
    type:String,
    label:"Match Start Time",
    optional:true
  },
	"matchDate":{
    	type:Date,
    	label:"Match Date",
    	optional:true
  	},
  	"rallyType":{
    	type:String,
    	label:"Rally Type",
    	allowedValues: ['partial', 'complete'],
  	},
  	"playerA":{
    	type: playerSetSchema,
    	label: "playerA set",
  	},
  	"playerB":
  	{
    	type: playerSetSchema,
    	label: "playerB set",
  	},
  	"sequenceRecordDate":
  	{
  		type:Date,
  		label:"Sequence Recorded Date"
  	},
  	"serviceHand":{
  		type:String,
  		label:"service hand"
  	},
  	"serviceDestination":{
  		type:String,
  		label:"service destination"
  	},
  	"strokesPlayed":{
  		type:[strokesArr],
		label:"strokesPlayed"
  	},
  	"combinedStrokes":{
  		type:[String],
  		label:"combinedStrokes"
  	},
  	"analyticsCache":{
  		type:AnalyticsCache,
  		label:"Analytics Cache"
  	}
});

var sequenceSchema  =  new SimpleSchema({
	loggerId:{
		type:String,
		label:"Logger Id"
	},
	player1Name:{
		type:String,
		label:"Player1 Name",
	},
	player2Name:{
		type:String,
		label:"Player2 Name",
	},
	player1Id:{
		type:String,
		label:"Player1 ID",
	},
	player2Id:{
		type:String,
		label:"Player2 ID",
	},
	sequence:{
		type:[SequenceInfo],
		label:"Sequence List"
	}
});

sequenceDataRecord.attachSchema(sequenceSchema);

/************************************************************************************/
sequenceShareHistory = new Meteor.Collection('sequenceShareHistory');

var PlayerInfo = new SimpleSchema ({
  "userId":{
    type:String,
    label:"Player UserId",
    optional:true
  },
  "playerName":{
    type:String,
    label:"Player Name",
    optional:true
  }
});

var sequenceShareHistorySchema  =  new SimpleSchema({
  loggerId:{
    type:String,
    label:"Logger Id"
  },
  sharedId:{
    type:String,
    label:"Shared To"
  },
  player1Name:{
    type:String,
    label:"Player1 Name",
  },
  player2Name:{
    type:String,
    label:"Player2 Name",
  },
  sequenceCount:{
    type:Number,
    label:"Sequence Count",
  },
  sequenceSharedDate:{
    type:Date,
    label:"Sequence Shared Date",
    autoValue : function() {
      if (this.isInsert) {
      return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert : new Date()
        };
      } else {
        this.unset();
      }
    }
  },
  playerList:{
    type:[PlayerInfo],
    label:"Players Moved",
    optional:true
  }
});
sequenceShareHistory.attachSchema(sequenceShareHistorySchema);


/*****************************************************************/
sequenceDataRecordTemp = new Meteor.Collection('sequenceDataRecordTemp');
sequenceDataRecordTemp.attachSchema(sequenceSchema);


/*****************************************************************/
sequenceDataRecordTemp1 = new Meteor.Collection('sequenceDataRecordTemp1');
sequenceDataRecordTemp1.attachSchema(sequenceSchema);