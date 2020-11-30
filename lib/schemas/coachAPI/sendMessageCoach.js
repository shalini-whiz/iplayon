
coachAppMessageSentBOX = new Meteor.Collection('coachAppMessageSentBOX');

var coachAppMessageSentBOXSchema  =  new SimpleSchema({
	senderId:{
		type:String,
		label:"userId of coach or player",
		optional:true
	},
	senderRole:{
		type:String,
		label:"coach or player",
		optional:true
	},
	messageType:{
		type:String,
		label:"text or calendar request",
		optional:true
	},
	receiverRole:{
		type:String,
		label:"coach or player or group",
		optional:true
	},
	receiverId:{
		type:String,
		label:"userId or groupId",
		optional:true
	}, 
	status:{
		type:String,
		label:"pending, accepted, rejected",
		optional:true
	}, 
	calendarDateTime :{
		type:Date,
		label:"calendar request date",
		optional:true
	},
	calendarLink:{
		type:String,
		label:"If there are any link in calendar request",
		optional:true
	},
	calendarCall:{
		type:String,
		label:"If there are any contact Number in calendar request",
		optional:true
	},
	textMessage:{
		type:String,
		label:"Text message",
		optional:true
	},
	statusOfSentMessage:{
		type:String,
		label:"deleted or active",
		optional:true
	},
	sentDateAndTime : {
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
	offset:{
		type : Number,
		autoValue : function() {
			if (this.isInsert) {
				return new Date().getTimezoneOffset();
			} else if (this.isUpdate) {
				return new Date().getTimezoneOffset();
			} else {
				this.unset();
			}
		}
	}, 
	receiverName:{
		type:String,
		label:"Name of the receiver",
		optional:true
	},
	senderName:{
		type:String,
		label:"Name of the sender",
		optional:true
	},
});
coachAppMessageSentBOX.attachSchema(coachAppMessageSentBOXSchema);
