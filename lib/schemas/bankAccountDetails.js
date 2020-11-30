accountDetails = new Mongo.Collection('accountDetails');


var valueSchema = new SimpleSchema({
	"key":{
		type:String,
		label:"key "
	},
	"value":{
		type:String,
		label:"value"
	}
})


accountDetailsSchema = new SimpleSchema({
	"userId": {
		type: String,
		label: "ID of currently logged-in user"
	},
	"bankName":{
		type:String,
		label:"Bank Name"
	},
	"accType":{
		type: String,
		label: "Account Type"
	},
	"accNo":{
		type:String,
		label:"Account No",
	},
	"accIfsc":{
		type:String,
		label:"Account IFSC"
	},
	"taxLiable":{
		type:String,
		label:"tax liable"
	},
	"gstNo":{
		type:String,
		label:"GST No",
		optional:true
	},
	"nationalIdentities":{
		type:[valueSchema],
		label:"national Identities",
		optional:true
	},
	"nationalIdentityType":{
		type:String,
		label:"nationalIdentity Type ",
		optional:true
	},
	"nationalIdentityNo":{
		type:String,
		label:"nationalIdentity No ",
		optional:true
	},
	"panNo":{
		type:String,
		label:"Pan No",
		optional:true
	},
	"status":{
		type:String,
		label:"Account status",
		defaultValue:"active"
	},


});

accountDetails.attachSchema(accountDetailsSchema);


/************************************************************/
customDataDB = new Mongo.Collection('customDataDB');

var valueDataSchema = new SimpleSchema({
	"key":{
		type:String,
		label:"valueData key "
	},
	"mandatory":{
		type:String,
		label:"key mandatory or not"
	}
})

var customKeyDataSchema = new SimpleSchema({
	"country":{
		type:String,
		label:"feature key "
	},
	"valueSet":{
		type:[valueDataSchema],
		label:"feature key value"
	},
})

var genericKeyDataSchema = new SimpleSchema({
	"keySet":{
		type:String,
		label:"feature key "
	},
	"indexSet":{
		type:String,
		label:"feature key"
	},
	"valueSet":{
		type:[String],
		label:"feature key value123"
	},
})


customDataDBSchema = new SimpleSchema({
	"type": {
		type: String,
		label: "custom data type"
	},

	"customData":{
		type:[String],
		label:"customData",
		optional:true
	},
	"customKeyData":{
		type:[customKeyDataSchema],
		label:"customKeyData",
		optional:true
	},
	"customValue":{
		type:String,
		label:"custom value",
		optional:true
	},
	"customKeyValueData":{
		type:[genericKeyDataSchema],
		label:"customKeyValueData key value",
		optional:true

	}
});
customDataDB.attachSchema(customDataDBSchema);
