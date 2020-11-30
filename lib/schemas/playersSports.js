userDetailsTT = new Meteor.Collection('userDetailsTT');
var userDetailsTTSchema = new SimpleSchema({

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
		defaultValue:"",
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
		label:"Player DOB",		
		optional:true
	},
	guardianName:{
		type:String,
		label:"Player Guardian",		
		optional:true
	},
	motherName:{
		type:String,
		label:"Player Mother",		
		optional:true
	},
	phoneNumber:{
		type:String,	
		defaultValue:"",
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
		defaultValue:""
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
		defaultValue:""
	},
	schoolId:{
		type:String,
		label:"Player School ID",		
		optional:true
	},
	clubName:{
		type:String,
		label:"Academy Name",		
		optional:true
	},

	clubNameId:{
		type:String,
		label:"Player Academy ID",		
		optional:true
	},
	associationId:{
		type:String,
		label:"Player Association ID",		
		optional:true
	},
	parentAssociationId:{
		type:String,
		label:"Player Parent Association ID",		
		optional:true
	},
	year:{
		type:String,
		label:"Player year",		
		optional:true
	},
	statusOfUser:{
		type:String,
		label:"Player Status",		
		optional:true
	},
	affiliationId:{
		type:String,
		label:"Player Affiliation ID",		
		optional:true
	},
	nationalAffiliationId:{
		type:String,
		label:"Player National Affiliation ID",		
		optional:true
	},
	affiliatedTo:{
        type:String,
        label:"districtAssociation or stateAssociation or Academy",
    },
    tempAffiliationId:{
		type:String,
		label:"Player Temporary Affiliation ID"
    },
    source:{
    	type:String,
    	defaultValue:""
    },
    emailIdVerified:{
    	type:Boolean,
    	optional:true
    },
    phoneVerified:{
    	type:Boolean,
    	optional:true
    },
    userStatus:{
    	type:String,
    	defaultValue:"",
    	optional:true
    }
});

userDetailsTT.attachSchema(userDetailsTTSchema);

userDetailsBT = new Meteor.Collection('userDetailsBT');
userDetailsBT.attachSchema(userDetailsTTSchema);

userDetailsBB = new Meteor.Collection('userDetailsBB');
userDetailsBB.attachSchema(userDetailsTTSchema);