packsOfPublisher = new Meteor.Collection('packsOfPublisher');

var packFeatureSchema = new SimpleSchema({
	"key":{
		type:String,
		label:"feature key "
	},
	"value":{
		type:String,
		label:"feature key value"
	},
	"keyType":{
		type:String,
		label:"feature key type"
	},
	"valueType":{
		type:String,
		label:"feature value type"
	},


})

var packsOfPublisherSchema  =  new SimpleSchema({
	packs:{
		type:[String],
		label:"type of packs",
		optional:true
	},
});

packsOfPublisher.attachSchema(packsOfPublisherSchema);

categoryOfPublisher = new Meteor.Collection('categoryOfPublisher');

var categoryOfPublisherSchema  =  new SimpleSchema({
	category:{
		type:[String],
		label:"sports",
		optional:true
	},
});

categoryOfPublisher.attachSchema(categoryOfPublisherSchema);


/**************************** pack features *************************************/

packFeatures = new Meteor.Collection('packFeatures');

var packFeaturesSchema  =  new SimpleSchema({
	features:{
		type:[String],
		label:"pack features",
		optional:true
	},
});

packFeatures.attachSchema(packFeaturesSchema);