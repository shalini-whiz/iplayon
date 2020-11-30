inbox = new Meteor.Collection('inbox');

var inboxSchema  =  new SimpleSchema({
	userId:{
		type:String,
		label:"User-Id of the user",
		optional:true
	},
	userToAct:{
		type:String,
		label:"User-Id who is supposed to take the action",
		optional:true
	},
	messages:{
		type:String,
		label:"Messages that belongs to the corresponding user",
		optional:true
	},
	teamId:{
		type:String,
		label:"Team for which the message corresponds to",
		optional:true
	},
});
inbox.attachSchema(inboxSchema);