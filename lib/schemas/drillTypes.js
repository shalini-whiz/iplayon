drillTypes = new Meteor.Collection('drillTypes');

var drillTypesSchema  =  new SimpleSchema({
	drillType:{
		type:[String]
	},
	drillIntensity:{
		type:[String],
	},
	drillDuration:{
		type:[String]
	},
	drillStatus:{
		type:[String]
	}
});

drillTypes.attachSchema(drillTypesSchema);


drillTimeIntensity = new Meteor.Collection('drillTimeIntensity');

var drillTimeIntensitySchema  =  new SimpleSchema({
	Tt:{
		type:String
	}
});

drillTimeIntensity.attachSchema(drillTimeIntensitySchema);

metaMotionRData = new Meteor.Collection('metaMotionRData');

var metaMotionRDataSchema  =  new SimpleSchema({
	coachId:{
		type:String
	},
	playerId:{
		type:String
	},
	drillId:{
		type:String
	},
	durationInSecs:{
		type:String
	},
	intensityType:{
		type:String
	},
	noOfImpacts:{
		type:Number
	},
	arrayOfImpacts:{
		type:[String]
	},
	count:{
		type:Number
	},
	durationInMins:{
		type:String
	},
	startTime:{
		type:String
	},
	endTime:{
		type:String
	},
	startTimeDate:{
		type:Date
	},
	endTimeDate:{
		type:Date
	},
	timerTime:{
		type:String
	},
	completed:{
		type:String
	},
	durationInHours:{
		type:String
	},
	Tt:{
		type:String
	},
	arrayOfTimeStamp:{
		type:[String]
	},
	efficiency:{
		type:String
	},
	startDate:{
		type:Date
	},
	endDate:{
		type:Date
	},
	month:{
		type:String
	},
	year:{
		type:String
	}
});

metaMotionRData.attachSchema(metaMotionRDataSchema);