associations = new Meteor.Collection('associations');

var associationsSchema  =  new SimpleSchema({
	associationName:{
		type:String,
		label:"Association Name"
	},
	associationId:{
		type:String,
		label:"Association Id saved to user db",
		optional:true
	},
	parentAssociationType:{
		type:String,
		label:"Association type parent",
		optional:true
	},
	associationType:{
		type:String,
		label:"Association type ",
		optional:true
	},
	"academyId":{
		type:[String],
		label:"Academy Id saved to user db",
		optional:true
	},
});
associations.attachSchema(associationsSchema);


/************************** association details schema ********************/
associationDetails = new Meteor.Collection('associationDetails');
var associationDetailsSchema = new SimpleSchema({

	role:{
		type:String,
		label:"Role",
		optional:true
	},
	userId:{
		type:String,		
		unique:true
	},
	associationName:{
		type:String,
		label:"association name"
	},
	contactPerson:{
		type:String,
		label:"association contact person Name",
		optional:true
	},
	
	emailAddress:{
		type:String,
		label:"Email Address of association",		
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
		label:"association DOB",		
		optional:true

	},
	guardianName:{
		type:String,
		label:"association Guardian",		
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
	parentAssociationId:{
		type:String,
		label:"association Parent Association ID",		
		optional:true

	},
	dateOfInc:{
		type:Date,
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
		label:"association year",		
		optional:true

	},
	statusOfUser:{
		type:String,
		label:"association Status",		
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
    emailIdVerified:{
    	type:Boolean,
    	optional:true
    },
    phoneVerified:{
    	type:Boolean,
    	optional:true
    },
    source:{
    	type:String,
    	optional:true
    }
});
associationDetails.attachSchema(associationDetailsSchema);



