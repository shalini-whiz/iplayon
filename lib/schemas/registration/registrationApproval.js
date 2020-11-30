registrationApproval = new Meteor.Collection('registrationApproval');

var registrationApprovalSchema  =  new SimpleSchema({
	"userId":{
		type:String,
		label:"User Id"
	},
	"associationId":{
		type:String,
		label:"associationId",
		optional:true

	},
	"validity":{
		type:Date,
		label:"User Validity",
	},
	"status":{
		type:String,
		label:"User Status",
		defaultValue:"active"
	},
	"createdDate" : {
		type : Date,
		autoValue : function() {
			if (this.isInsert) {
				return new Date();
			}
			else {
				this.unset();
			}
		}
	},
	"modifiedDate" : {
		type : Date,
		autoValue : function() {
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert : true,
		optional : true
	},
	/*"renewal":{


	}*/


	
});
registrationApproval.attachSchema(registrationApprovalSchema);