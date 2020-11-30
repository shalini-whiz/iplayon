tempSubCheck = new Meteor.Collection('tempSubCheck');

var tempSubCheckSchema  =  new SimpleSchema({
	userId:{
		type:String,
		label:"changed",
		unique: true
	}
});
tempSubCheck.attachSchema(tempSubCheckSchema);