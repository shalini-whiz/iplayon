

certification = new Meteor.Collection('certification');
var certificationSchema  =  new SimpleSchema({
	sportId:{
		type:String,
		label:"Certification Sport"
	},
	certification:{
		type:String,
		label:"Certification",
	},
});
certification.attachSchema(certificationSchema);