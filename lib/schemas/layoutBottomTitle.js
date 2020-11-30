layoutDefaultBottom = new Meteor.Collection('layoutDefaultBottom');


layoutDefaultBottomSchema = new SimpleSchema({
	title1:{
		type:String,
		label:"Ongoing Tournament",
		optional:true
	},
	title2:{
		type:String,
		label:"Event Name",
		optional:true
	},
	title1a:{
		type:String,
		label:"Ongoing Tournament",
		optional:true
	},
	title1b:{
		type:String,
		label:"Event Name",
		optional:true
	},
	title3:{
		type:String,
		label:"Event Date",
		optional:true
	},
	eventsExist:{
		type:Boolean,
		label:"if upcoming events list is not zero, set to true"
	}
});
layoutDefaultBottom.attachSchema(layoutDefaultBottomSchema);