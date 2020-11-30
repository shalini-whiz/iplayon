sentReceipt = new Meteor.Collection('sentReceipt');

var sentReceiptSchema  =  new SimpleSchema({
	sentReceiptUserId:{
		type:String,
		label:"player Id",
		optional:true
	},
	sentReceiptTournamentId:{
		type:String,
		label:"tournament Id",
		optional:true
	},
	eventIds:{
		type:[String],
		label:"event Ids",
		optional:true
	},
	paidOrNot:{
		type:String,
		label:"paid Or Not",
		optional:true
	},
	totalFees:{
		type:String,
		label:"total fees",
		optional:true
	},
	
});
sentReceipt.attachSchema(sentReceiptSchema);

overrideDueTotal = new Meteor.Collection('overrideDueTotal');

var overrideDueTotalSchema  =  new SimpleSchema({
	overrideUserId:{
		type:String,
		label:"player Id",
		optional:true
	},
	overrideDueAmt:{
		type:String,
		label:"over ride amount",
		optional:true
	},
	tournamentIds:{
		type:[String],
		label:"tourn ids",
		optional:true
	},
	eventOrganizer:{
		type:String,
		label:"event eventOrganizer",
		optional:true
	}
});
overrideDueTotal.attachSchema(overrideDueTotalSchema);

financials = new Meteor.Collection('financials');

var financialsSchema  =  new SimpleSchema({
	playerId:{
		type:String,
		label:"player Id",
		optional:true,
	},
	tournamentId:{
		type:String,
		label:"tournament Id",
		optional:true
	},
	"eventAbbName":{
		type:String,
		label:"event abbrevation name",
		optional:true
	},
	"eventFee":{
		type:String,
		label:"event Ids",
		optional:true
	},
	paidOrNot:{
		type:Boolean,
		label:"paid Or Not",
		optional:true
	},
	academyId:{
		type:String,
		label:"academyId",
		optional:true
	},
	totalFees:{
		type:String,
		label:"total fees",
		optional:true
	},
});

financials.attachSchema(financialsSchema);


academyfinancials = new Meteor.Collection('academyfinancials');

var academyfinancialsSchema  =  new SimpleSchema({
	tournamentId:{
		type:String,
		label:"tournament Id",
		optional:true
	},
	academyId:{
		type:String,
		label:"academyId",
		optional:true
	},
	totalFees:{
		type:String,
		label:"total fees",
		optional:true
	},
	paidOrNot:{
		type:Boolean,
		label:"paidOrNot",
		optional:true
	},
	"eventAbbName":{
		type:String,
		label:"event abb names",
		optional:true
	},
	"eventFee":{
		type:String,
		label:"event fees",
		optional:true
	},
});

academyfinancials.attachSchema(academyfinancialsSchema);