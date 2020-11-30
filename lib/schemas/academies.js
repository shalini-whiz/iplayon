academies = new Meteor.Collection('academies');

var academiesSchema  =  new SimpleSchema({
	academyName:{
		type:String,
		label:"Academy Name"
	},
	academyId:{
		type:String,
		label:"Academy Id saved to user db",
		optional:true
	},
	"playerUserId":{
		type:[String],
		label:"Player Id saved to user db",
		optional:true
	},


	
});
academies.attachSchema(academiesSchema);

/************************** academy details schema ********************/
academyDetails = new Meteor.Collection('academyDetails');
var academyDetailsSchema = new SimpleSchema({

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
		label:"Academy name"
	},
	contactPerson:{
		type:String,
		label:"Academy contact person Name",
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
		label:"Academy ID",		
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
		label:"Academy Affiliation ID",		
		optional:true

	},
	nationalAffiliationId:{
		type:String,
		label:"Academy National Affiliation ID",		
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
    }
    ,
    source:{
    	type:String,
    	optional:true
    }
});
academyDetails.attachSchema(academyDetailsSchema);