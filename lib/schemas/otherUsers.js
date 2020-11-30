
otherUsers = new Meteor.Collection('otherUsers');
var otherUsersSchema = new SimpleSchema({

	role:{
		type:String,
		label:"Role",
		optional:true
	},
	userName:{
		type:String,
		label:"User Name",
		optional:true

	},
	userId:{
		type:String,		
		optional:true
	},
	emailAddress:{
		type:String,
		label:"Email Address of user",		
		optional:true
	},
	interestedDomainName:{
		type:[String],
		label:"Domain Names",
		minCount:1,
		optional:true,		
		optional:true

		},
	interestedSubDomain1Name:{
		type:[String],
		label:"Sub Domain Names1",
		optional:true,		
		},
	interestedSubDomain2Name:{
		type:[String],
		label:"Sub Domain Names2",
		optional:true
	},
	interestedProjectName:{
		type:[String],
		label:"Project Names",
		optional:true
		},
	
	gender:{
		type:String,
		optional:true
	},
	dateOfBirth:{
		type:Date,
		label:"Player DOB",		
		optional:true

	},
	guardianName:{
		type:String,
		label:"Player Guardian",		
		optional:true

	},
	phoneNumber:{
		type:String,		
		optional:true

	},
	address:{
		type:String,
		label:"Address",
		optional:true
	},
	city:{
		type:String,
		label:"City",		
		optional:true

	},
	state:{
		type:String,
		label:"State",		
		optional:true

	},
	country:{
		type:String,
		label:"Country",		
		optional:true

	},
	pinCode:{
		type:String,
		label:"Pincode",		
		optional:true

	},
	clubName:{
		type:String,
		label:"User Academy Name",		
		optional:true

	},
	clubNameId:{
		type:String,
		label:"User Academy ID",		
		optional:true

	},
	associationId:{
		type:String,
		label:"User Association ID",		
		optional:true

	},
	parentAssociationId:{
		type:String,
		label:"User Parent Association ID",		
		optional:true

	},
	year:{
		type:String,
		label:"User year",		
		optional:true

	},
	statusOfUser:{
		type:String,
		label:"User Status",		
		optional:true

	},
	affiliationId:{
		type:String,
		label:"User Affiliation ID",		
		optional:true

	},
	nationalAffiliationId:{
		type:String,
		label:"User National Affiliation ID",		
		optional:true

	},
	source:{
		type:String,
		label:"source",
		optional:true
	},
	languages:{
		type:[String],
		label:"Languages",
		optional:true
	},

	certifications:{
		type:[String],
		label:"certification",
		optional:true
	},
	expertise:{
		type:[String],
		label:"expertise",
		optional:true
	},
	travelAssignment:{
		type:Boolean,
		label:"Travel Assignment",
		optional:true
	}
});
otherUsers.attachSchema(otherUsersSchema);