
coachAPPINSentBOX = new Meteor.Collection('coachAPPINSentBOX');

var coachAPPINSentBOXSchema  =  new SimpleSchema({
	senderId:{
		type:String,
		label:"userId of coach or player"
	},
	senderRole:{
		type:String,
		label:"coach or player"
	},
	receiverRole:{
		type:String,
		label:"coach or player or group"
	},
	receiverId:{
		type:String,
		label:"userId or groupId"
	}, 
	message:{
		type:String,
		label:"recent message"
	},
	statusOfWholeMessage:{
		type:String,
		label:"deleted or active"
	},
	readUnreadWholeMessageStatus:{
		type:String,
		label:"message red or unread"
	},
	"messagesBox.$._id":{
		type:"String",
		label:"_id"
	},
	"messagesBox.$.offset":{
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
	"messagesBox.$.receivedDateAndTime":{
		type : Date,
		label:"receive date and time"
	},
	"messagesBox.$.messageType":{
		type:String,
		label:"text or calendar"
	},
	"messagesBox.$.message":{
		type:String,
		label:"text message"
	},
	"messagesBox.$.senderId":{
		type:String,
		label:"senderId"
	},
	"messagesBox.$.receiverId":{
		type:String,
		label:"receiverId"
	},
	"messagesBox.$.senderRole":{
		type:String,
		label:"senderRole"
	},
	"messagesBox.$.receiverRole":{
		type:String,
		label:"receiverRole"
	},
	"messagesBox.$.calendarAcceptedIds":{
		type:[String],
		label:"Array of ids who accepted calendar request",
		optional:true
	},
	"messagesBox.$.calendarDateTime":{
		type : Date,
		label:"calendar req date and time",
		optional:true
	},
	"messagesBox.$.calendarRejectedIds":{
		type:[String],
		label:"Array of ids who rejected calendar request",
		optional:true
	},
	"messagesBox.$.linkCall":{
		type:String,
		label:"link or call",
		optional:true
	},
	"messagesBox.$.deleteIds":{
		type:[String],
		label:"Array of ids who deleted message",
		optional:true
	},
	"messagesBox.$.set":{
		type:String,
		label:"set",
		optional:true
	},
	"messagesBox.$.setRepeat":{
		type:String,
		label:"set repeat",
		optional:true
	},
	"messagesBox.$.startBy":{
		type:Date,
		label:"startBy",
		optional:true
	},
	"messagesBox.$.finishBy":{
		type:Date,
		label:"finishBy",
		optional:true
	},
	receivedDateAndTime : {
		type : Date,
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

coachAPPINSentBOX.attachSchema(coachAPPINSentBOXSchema);

coachAPPSentBOX = new Meteor.Collection('coachAPPSentBOX');

var coachAPPSentBOXSchema  =  new SimpleSchema({
	senderId:{
		type:String,
		label:"userId of coach or player"
	},
	senderRole:{
		type:String,
		label:"coach or player"
	},
	receiverRole:{
		type:String,
		label:"coach or player or group"
	},
	receiverId:{
		type:String,
		label:"userId or groupId"
	}, 
	statusOfWholeMessage:{
		type:String,
		label:"deleted or active"
	},
	readUnreadWholeMessageStatus:{
		type:String,
		label:"message red or unread"
	},
	"messagesBox.$.receivedDateAndTime":{
		type : Date,
		label:"receive date and time"
	},
	"messagesBox.$.messageType":{
		type:String,
		label:"text or calendar"
	},
	"messagesBox.$.message":{
		type:String,
		label:"text message"
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

});

coachAPPSentBOX.attachSchema(coachAPPSentBOXSchema);
