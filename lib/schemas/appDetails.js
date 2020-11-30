appDetails = new Meteor.Collection('appDetails');

appDetailsSchema = new SimpleSchema({
	"appName":{
		type:String,
	},
	"appStatus":{
		type:Boolean,
		defaultValue:false
	}
})

appDetails.attachSchema(appDetailsSchema);