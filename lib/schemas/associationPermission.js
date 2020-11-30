associationPermissions = new Meteor.Collection('associationPermissions');

var associationPermissionsSchema  =  new SimpleSchema({
	associationId:{
		type:String,
		label:"associationId",
		optional:true
	},
	playerEntry:{
		type:String,
		label:"entry type for player",
		optional:true
	},
	districtAssocEntry:{
		type:String,
		label:"entry type for diss association",
		optional:true
	},
	academyEntry:{
		type:String,
		label:"entry type for club",
		optional:true
	},
	playerEditSet:{
		type:String,
		label:"edit settings for player",
		optional:true
	},
	districtAssocEditSet:{
		type:String,
		label:"edit settings for diss association",
		optional:true
	},
	academyEditSet:{
		type:String,
		label:"edit settings for academy",
		optional:true
	},
	playerChangePass:{
		type:String,
		label:"password for player",
		optional:true
	},
	districtAssocChangePass:{
		type:String,
		label:"password for distric association",
		optional:true
	},
	academyChangePass:{
		type:String,
		label:"password for academy",
		optional:true
	}
	
});
associationPermissions.attachSchema(associationPermissionsSchema);