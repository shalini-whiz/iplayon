myEntriesReadStatus = new Meteor.Collection('myEntriesReadStatus');

var myEntriesReadStatusSchema  =  new SimpleSchema({
	userId:{
		type:String,
		label:"User-Id of the user"
	},
	eventId:{
		type:String,
		label:"Event Id of the Entry"
	},
	readStatus:{
		type:Boolean,
		label:"Read status of my-entry"
	}
});
myEntriesReadStatus.attachSchema(myEntriesReadStatusSchema);