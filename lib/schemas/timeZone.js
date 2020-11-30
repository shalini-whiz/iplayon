timeZone = new Meteor.Collection('timeZone');

var timeZoneSchema  =  new SimpleSchema({
	countryName:{
		type:String
	},
	"state.$.stateId":{
		type:String,
		label:"State Id",
		optional:true
	},	
	"state.$.stateName":{
		type:String,
		label:"State Name",
		optional:true
	},
	tz:{
		type:String
	},
	latitude:{
		type:String
	},
	longitude:{
		type:String
	},
	timeStamp:{
		type:String
	},
	timeStampCreatedDate : {
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
	timeStampUpdatedDate : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
	},
	
});

timeZone.attachSchema(timeZoneSchema);