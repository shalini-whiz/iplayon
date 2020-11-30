subscriptionRestrictions = new Meteor.Collection('subscriptionRestrictions');

var subscriptionRestrictionsSchema  =  new SimpleSchema({
	tournamentId:{
		type:String
	},
	eventOrganizerId:{
		type:String
	},
	role:{
		type:String
	},
	selectionType:{
		type:String,
		label:"all, self, restrict, pick"
	},
	selectedIds:{
		type:[String],
		optional:true
	},
	tournamentType:{
		type:String,
		optional:true
	}
});
subscriptionRestrictions.attachSchema(subscriptionRestrictionsSchema);

