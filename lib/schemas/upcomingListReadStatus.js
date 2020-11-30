upcomingListsReadStatus = new Meteor.Collection('upcomingListsReadStatus');
upcomingListsReadStatusSchema = new SimpleSchema({
	"userId":{
		type:String,
		label:"Event Name",
		//min:5,
		//max:100,
		//exclusiveMin:true,
		//exclusiveMax:true,
		//regEx:/^[a-zA-Z0-9]/
	},
	"eventIdReadStatus.$.eventId":{
		type:String,
		label:"Event Id",
		optional:true
	},	
	"eventIdReadStatus.$.readStatus":{
		type:Boolean,
		label:"Event Id Read Status",
		optional:true
	},
	/*"eventCreatedDate" : {
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
	"eventUpdatedDate" : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
	}*/
});
upcomingListsReadStatus.attachSchema(upcomingListsReadStatusSchema);