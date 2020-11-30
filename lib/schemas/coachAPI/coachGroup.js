coachConnectedGroups = new Meteor.Collection('coachConnectedGroups');

var coachConnectedGroupsSchema  =  new SimpleSchema({
	loggedInId:{
		type:String,
		label:"userId of coach or player"
	},
	groupName:{
		type:String,
		label:"group name"
	},
	createdDateAndTime : {
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
	updatedDateAndTime : {
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
	groupMembers:{
		type:[String],
		label:"array of userIds which may include coachId and playerId"
	}
});
coachConnectedGroups.attachSchema(coachConnectedGroupsSchema);
