affiliationIdType = new Meteor.Collection('affiliationIdType');

var affiliationIdTypeSchema  =  new SimpleSchema({
	stateAssocId:{
		type:String,
		label:"State Association Id",
		optional:true
	},
	firTCharType:{
		type:String,
		label:"first 3 characters type",
		optional:true
	},
	"fixedCharcters":{
		type:String,
		label:"if fixed type, fixed characters",
		optional:true
	},
});
affiliationIdType.attachSchema(affiliationIdTypeSchema);

lastInsertedAffId = new Meteor.Collection('lastInsertedAffId');

var lastInsertedAffIdSchema = new SimpleSchema({
	assocId:{
		type:String,
		label:"Association Id",
		optional:true
	},
	lastInsertedId:{
		type:String,
		label:"Last inserted id",
		optional:true
	},
});

lastInsertedAffId.attachSchema(lastInsertedAffIdSchema);

teamAffiliationId = new Meteor.Collection('teamAffiliationId');

var teamAffiliationIdSchema = new SimpleSchema({
	managerId:{
		type:String,
		label:"manager user Id",
		optional:true
	},
	teamAffiliationId:{
		type:String,
		label:"Last inserted id",
		optional:true
	},
});

teamAffiliationId.attachSchema(teamAffiliationIdSchema);