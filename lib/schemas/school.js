

/************************** school details schema ********************/

var schoolPlayerSchema = new SimpleSchema ({
  "studentID" : {
    type: String,
    label: "Student ID",
  },
  "class" : {
    type: String,
    label: "Student Class",
  }
});


var coachSchema = new SimpleSchema ({
  "userName" : {
    type: String,
    label: "Coach",
  },
  "gender" : {
    type: String,
    label: "Coach gender",
  },
  "phoneNumber":{
  	type:String,
  	label:"Coach phoneNumber",
  	optional:true
  }
});


schoolDetails = new Meteor.Collection('schoolDetails');
var schoolDetailsSchema = new SimpleSchema({
	role:{
		type:String,
		label:"Role",
		optional:true
	},
	userId:{
		type:String,		
		optional:true
	},
	schoolName:{
		type:String,
		label:"School name"
	},
	contactPerson:{
		type:String,
		label:"School contact person Name",
		optional:true
	},
	emailAddress:{
		type:String,
		label:"Email Address of School",		
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
	landline:{
		type:String,		
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
		label:"School Association ID",		
		optional:true
	},
	parentAssociationId:{
		type:String,
		label:"School Parent Association ID",		
		optional:true
	},
	dateOfInc:{
		type:Date,
		optional:true
	},
	abbrevation:{
		type:String,
		optional:true
	},
	year:{
		type:String,
		label:"School year",		
		optional:true
	},
	statusOfUser:{
		type:String,
		label:"School Status",		
		optional:true
	},
	affiliationId:{
		type:String,
		label:"School Affiliation ID",		
		optional:true
	},
	nationalAffiliationId:{
		type:String,
		label:"School National Affiliation ID",		
		optional:true
	},
	affiliatedTo:{
        type:String,
        label:"School affiliatedTo",
    },
    playerId:{
    	type:[schoolPlayerSchema],
    	label:"list of players under school",
    	optional:true
    },
    coachId:{
    	type:[coachSchema],
    	label:"list of players under school",
    	optional:true
    },

});
schoolDetails.attachSchema(schoolDetailsSchema);


/**************************** temporary school db on category *********************/



var playerCategorySchema = new SimpleSchema ({
  "userId" : {
    type: [String],
    label: "Array of Student ID",
  },
  "schoolId":{
  	type:String,
  	label:"School ID"
  },
  "category" : {
    type: String,
    label: "Student category",
  },
  "year" : {
	type : String,
	label:"year of reg"
	}
});

playerCategory = new Meteor.Collection('playerCategory');
playerCategory.attachSchema(playerCategorySchema);
