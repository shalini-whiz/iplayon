var emailSchema = new SimpleSchema ({
  "address":{
    type:String,
    label:"email address",
    optional:true
  },
  "verified":{
    type:Boolean,
    label:"email verified status",
    optional:true
  }
});

userTemp = new Meteor.Collection('userTemp');
var userTempSchema = new SimpleSchema({
	
	userName:{
		type:String,
		label:"user name",
		optional:true
	},
	role:{
		type:String,
		label:"Role",
		optional:true
	},
	userId:{
		type:String,		
		optional:true
	},
	clubName:{
		type:String,
		label:"clubName",
		optional:true

	},
	clubNameId:{
		type:String,
		label:"clubNameId",
		optional:true

	},
	contactPerson:{
		type:String,
		label:"contact person",
		optional:true
	},
	
	emailAddress:{
		type:String,
		label:"Email Address of Academy",		
		optional:true
	},
	interestedDomainName:{
		type:[String],
		label:"Domain Names",
		minCount:1,
		optional:true,		
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
		label:"Academy DOB",		
		optional:true
	},
	guardianName:{
		type:String,
		label:"Academy Guardian",		
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
	associationId:{
		type:String,
		label:"Association ID",		
		optional:true
	},
	parentAssociationId:{
		type:String,
		label:"Academy Parent Association ID",		
		optional:true
	},
	dateOfInc:{
		type:Date,
		optional:true
	},
	abbrevationAcademy:{
		type:String,
		optional:true
	},
	abbrevationAssociation:{
		type:String,
		optional:true
	},
	associationType:{
		type:String,
		optional:true
	},
	year:{
		type:String,
		label:"Academy year",		
		optional:true

	},
	statusOfUser:{
		type:String,
		label:"Academy Status",		
		optional:true

	},
	affiliationId:{
		type:String,
		label:"Affiliation ID",		
		optional:true

	},
	nationalAffiliationId:{
		type:String,
		label:"National Affiliation ID",		
		optional:true

	},
    profileSettingStatus:{
    	type:Boolean,
    	optional:true
    },
    "emails.$":{
    type:emailSchema,
    label:"email array",
    optional:true
  },

});
userTemp.attachSchema(userTempSchema);