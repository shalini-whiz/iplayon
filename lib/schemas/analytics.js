/**************************** Analytics Approval Schema ****************************/
/**************************** Analytics Approval Master Schema ****************************/

analyticsApprovalMaster = new Meteor.Collection('analyticsApprovalMaster');

var masterSchema = new SimpleSchema ({
   "defaultValue" : {
    type: String,
    defaultValue:"",
  },
  "valueSet" : {
    type: String,
    defaultValue:"",
  }
});

var masterDateSchema = new SimpleSchema ({
   "defaultValue" : {
    type: Date,
    defaultValue:new Date()
  },
  "valueSet" : {
    type: String,
    defaultValue:"",
  }
});

var approveAnalyticsMasterSchema  =  new SimpleSchema({
	userId:{
		type:masterSchema,
		label:"Master Analytics UserId"
	},
	validity:{
		type:masterDateSchema,
		label:"MAster Analytics Validity",
		optional:true
	},
	status:{
		type:masterSchema,
		label:"Master Analytics status"
	},
	
});
analyticsApprovalMaster.attachSchema(approveAnalyticsMasterSchema);

/**************************** Analytics Approval  Schema ****************************/
analyticsApproval = new Meteor.Collection('analyticsApproval');

var approveAnalyticsSchema  =  new SimpleSchema({
	userId:{
		type:String,
		label:"Analytics UserId"
	},
	validity:{
		type:Date,
		label:"Analytics Validity",
	},
	status:{
		type:String,
		label:"Analytics User Status",
		defaultValue:"Active"
	},
	
});
analyticsApproval.attachSchema(approveAnalyticsSchema);

