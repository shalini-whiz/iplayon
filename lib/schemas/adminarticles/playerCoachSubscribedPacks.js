



var featurePackSchema  =  new SimpleSchema({
	key:{
		type:String,
		label:"feature name",
		optional:true
	},
	value:{
		type:String,
		label:"feature value",
		optional:true
	},
	masterVal:{
		type:String,
		label:"feature master value",
		optional:true
	},
	title:{
		type:String,
		label:"title of feature",
		optional:true
	}
});




userSubscribedPacks = new Meteor.Collection('userSubscribedPacks');

var userSubscribedPacksSchema  =  new SimpleSchema({
	packPayToUserRole:{
		type:String,
		label:"pack pay to user role",
		optional:true
	},
	roleOfSubscriber:{
		type:String,
		label:"type of subscriber",
		optional:true
	},
	userId:{
		type:String,
		label:"userId of coach or player",
		optional:true
	},
	packId:{
		type:String,
		label:"packId",
		optional:true
	},
	packPayToUserId:{
		type:String,
		label:"pack pay to user role userId",
		optional:true
	},
	transactionId:{
		type:String,
		label:"transactionId of paid by coach or player",
		optional:true
	},
	amount:{
		type:String,
		label:"amount  paid",
		optional:true
	},
	messageCount:{
		type:String,
		label:"messageCount of plan",
		optional:true
	},
	videoCount:{
		type:String,
		label:"videoCount of plan",
		optional:true
	},
	videoAnalysisCount:{
		type:String,
		label:"videoAnalysisCount of plan",
		optional:true
	},
	remainingDaysOfPlan:{
		type:String,
		label:"remaining days",
		optional:true
	},
	planStartsOn:{
		type:Date,
		label:"validityDays of plan",
		optional:true
	},
	planEndsOn:{
		type:Date,
		label:"validityDays of plan",
		optional:true
	},
	"features":{
		type:[featurePackSchema],
		label:"Pack Feature",
		optional:true
	},
	adminTransaction:{
		type:String,
		defaultValue:"not paid"
	},
	paidDate:{
		type : Date,
		optional:true
	},
	"adminReceiptOn":{
		type : Date,
		optional:true
	},
	taxRate:{
		type:String,
		optional:true
	},
	"cgstTax":{
		type:String,
		optional:true
	},
	"sgstTax":{
		type:String,
		optional:true
	},
	"commissionRate":{
		type:String,
		optional:true
	},
	"offset":{
		type:Number,

	},
	"offsetOfDomain":{
		type:Number,
		optional:true
	},
	"timeZoneName":{
		type:String,
		optional:true
	},
	statusFromFinance:{
		type:String,
		optional:true
	},
	acknowledgeStatus:{
		type:String,
		optional:true
	},
	"buyerAmount":{
		type:String,
		optional:true
	},
	"sellerAmount":{
		type:String,
		optional:true
	},
	"sellerTax":{
		type:String,
		optional:true
	},
	"sellerTaxLiable":{
		type:String,
		optional:true
	},
	"invoiceDate":{
		type : Date,
		optional:true
	},
	"receiptNo":{
		type:String,
		optional:true
	}
});

userSubscribedPacks.attachSchema(userSubscribedPacksSchema);