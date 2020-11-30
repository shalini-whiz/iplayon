languages = new Meteor.Collection('languages');
var languagesSchema = new SimpleSchema({
	language:{
		type:String,
		label:"language",
		optional:true
	}
});
languages.attachSchema(languagesSchema);



expertise = new Meteor.Collection('expertise');
var expertiseSchema = new SimpleSchema({
	expertise:{
		type:String,
		label:"expertise",
		optional:true
	}
});
expertise.attachSchema(expertiseSchema);

