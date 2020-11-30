connectionRequests = new Meteor.Collection('connectionRequests');

var connectionRequestsSchema  =  new SimpleSchema({
	loggedInId:{
		type:String,
		label:"userId of coach or player"
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
	responseDateAndTime : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
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
	toEntity:{
		type:String,
		label:"player or coach or group",
		optional:true
	},
	playerId:{
		type:String,
		label:"if request is for player",
		optional:true
	},
	coachId:{
		type:String,
		label:"if request is for coach",
		optional:true
	},
	groupId:{
		type:String,
		label:"if request is for group",
		optional:true
	},
	status:{
		type:String,
		label:"accepted or rejected ELSE pending",
		optional:true
	},
	loggedInRole:{
		type:String,
		label:"coach or player",
		optional:true
	},
	receiverId:{
		type:String,
		label:"receiver id field",
		optional:true
	}
});
connectionRequests.attachSchema(connectionRequestsSchema);
