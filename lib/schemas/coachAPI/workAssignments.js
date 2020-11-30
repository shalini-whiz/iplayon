
workAssignments = new Meteor.Collection('workAssignments');

assignmentStatus = new SimpleSchema ({
  "userId" : {
    type:String,
    label:"receiverId",
  },
  "userDate" : {
    type:Date,
    label:"playerBId",
    defaultValue:new Date()
  },
  "userStatus" : {
    type:String,
    label:"assignment status",
  },

});


var workAssignmentsSchema  =  new SimpleSchema({
	"senderId":{
		type:String,
		label:"userId of coach or player"
	},
	"senderRole":{
		type:String,
		label:"coach or player"
	},
	"receiverRole":{
		type:String,
		label:"coach or player or group"
	},
	"receiverId":{
		type:String,
		label:"userId or groupId"
	}, 
	"receivedDateAndTime" : {
		type : Date,
	},	
	"offset":{
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
	"messagesBox.$.set":{
		type:String,
		label:"set",
	},
	"messagesBox.$.setRepeat":{
		type:String,
		label:"set repeat",
	},
	"messagesBox.$.startBy":{
		type:Date,
		label:"startBy",
	},
	"messagesBox.$.finishBy":{
		type:Date,
		label:"finishBy",
	},
	"messagesBox.$.readIds":{
		type:[String],
		label:"Array of ids - read",
		optional:true
	},
	"messagesBox.$.unreadIds":{
		type:[String],
		label:"Array of ids - unread",
		optional:true
	},
	"messagesBox.$.deleteIds":{
		type:[String],
		label:"Array of ids who deleted message",
		optional:true
	},
	"messagesBox.$.statusId":{
		type:[String],
		label:"Array of ids who deleted message",
		optional:true
	},
	"messagesBox.$.assignmentStatus":{
		type:[assignmentStatus],
		label:"assignment status",
		optional:true
	}
	
	
});

workAssignments.attachSchema(workAssignmentsSchema);