adminSportsRoles = new Meteor.Collection('adminSportsRoles');

var adminSportsRolesSchema = new SimpleSchema({
	dbNames:{
		type:[String],
		label:"dbNames",
		optional:true
	},
	roles:{
		type:[String],
		label:"roles",
		optional:true
	},
	sports:{
		type:[String],
		label:"sports",
		optional:true
	},
	playersDB:{
		type:[String],
		label:"playersDB",
		optional:true
	},
	indexToSkip:{
		type:Number,
		label:"indexToSkip",
		optional:true
	},
	indicesOfPlayers:{
		type:[Number],
		label:"indicesOfPlayers",
		optional:true
	},
	lastInsertedInd:{
		type:Number,
		label:"lastInsertedInd",
		optional:true
	}
});

adminSportsRoles.attachSchema(adminSportsRolesSchema);