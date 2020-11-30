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
	title:{
		type:String,
		label:"title of feature",
		optional:true
	}
});

articlesOfPublisher = new Meteor.Collection('articlesOfPublisher');

var articlesOfPublisherSchema  =  new SimpleSchema({
	type:{
		type:String,
		label:"type of player",
		optional:true
	},
	userId:{
		type:String,
		label:"userId of coach or player",
		optional:true
	},
	role:{
		type:String,
		label:"coach or player",
		optional:true
	},
	articleDesc:{
		type:String,
		label:"article description",
		optional:true
	},
	title:{
		type:String,
		label:"title of article",
		optional:true
	},
	planType:{
		type:String,
		label:"planType",
		optional:true
	},
	amount:{
		type:String,
		label:"amount of plan",
		optional:true
	},
	messageLimit:{
		type:String,
		label:"messageLimit of plan",
		optional:true
	},
	videoMinutesLimit:{
		type:String,
		label:"videoMinutesLimit of plan",
		optional:true
	},
	videoAnalysisLimit:{
		type:String,
		label:"videoAnalysisLimit of plan",
		optional:true
	},
	validityDays:{
		type:String,
		label:"validityDays of plan",
		optional:true
	},
	validityMonths:{
		type:String,
		label:"validityDays of plan",
		optional:true
	},
	validityYear:{
		type:String,
		label:"validityYear of plan",
		optional:true
	},
	subscriptionCount:{
		type:String,
		label:"validityYear of plan",
		optional:true
	},
	publishedDate:{
		type : Date,
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
	publishedUpdatedDate : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
	},
	status:{
		type:String,
		optional:true
	},
	adminStatus:{
		type:String,
    	defaultValue:"pending"

	},
	category:{
		type:String,
		optional:true
	},
	"features":{
		type:[featurePackSchema],
		label:"Pack Feature",
		optional:true
	}
});

articlesOfPublisher.attachSchema(articlesOfPublisherSchema);

