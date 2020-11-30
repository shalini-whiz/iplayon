
coachAppMessageInBOX = new Meteor.Collection('coachAppMessageInBOX');

var coachAppMessageInBOXSchema  =  new SimpleSchema({
	messageSentBoxId:{
		type:String,
		label:"id of the sent message from sent box"
	},
	senderId:{
		type:String,
		label:"userId of coach or player"
	},
	senderRole:{
		type:String,
		label:"coach or player"
	},
	messageType:{
		type:String,
		label:"text or calendar request"
	},
	receiverRole:{
		type:String,
		label:"coach or player or group"
	},
	receiverId:{
		type:String,
		label:"userId or groupId"
	}, 
	statusOfRecvdMessage:{
		type:String,
		label:"deleted or active"
	},
	readUnreadStatus:{
		type:String,
		label:"message red or unread"
	},
	receivedDateAndTime : {
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
	senderName:{
		type:String,
		label:"Name of the sender"
	},
	receiverName:{
		type:String,
		label:"Name of the receiver",
		optional:true
	},
	groupId:{
		type:String,
		label:"Id of the group",
		optional:true
	},
	receiverRoleIsGroup:{
		type:String,
		label:"Yes if receiverRole is group",
		optional:true
	},
	"statusIfGroupOrAll.$.receiverId":{
		type:String,
		label:"Id of message reader",
		optional:true
	},
	"statusIfGroupOrAll.$.readStatus":{
		type:String,
		label:"red or unread of message reader",
		optional:true
	},
	"statusIfGroupOrAll.$.statusOfRecvdMessage":{
		type:String,
		label:"deleted or not of message reader",
		optional:true
	}
});

coachAppMessageInBOX.attachSchema(coachAppMessageInBOXSchema);
