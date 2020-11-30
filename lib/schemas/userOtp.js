userOtp = new Meteor.Collection('userOtp');

var userOtpSchema  =  new SimpleSchema({
	emailAddress:{
		type:String
	},
	otp:{
		type:String,
		optional:true
	}
	
});
userOtp.attachSchema(userOtpSchema);

userLogins = new Meteor.Collection('userLogins');

var userLoginsSchema  =  new SimpleSchema({
	email:{
		type:String
	},
	approveStatus:{
		type:Boolean,
		optional:true
	}
	
});
userLogins.attachSchema(userLoginsSchema);