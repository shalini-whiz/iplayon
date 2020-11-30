calenderEvents = new Meteor.Collection('calenderEvents');

calenderEventsSchema = new SimpleSchema({
	eventName:{
		type:String,
		label:"Event Name",
	},
	eventStartDate1:{
		type:Date
	},

});
calenderEvents.attachSchema(calenderEventsSchema);